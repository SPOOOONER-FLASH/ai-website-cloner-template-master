"""Remove legacy Hyland badges before the HYDE watermark pass.

This is an offline, deterministic batch step. It reads the analysis manifest
created by ``watermark-product-images.mjs``, masks only the detected oval,
registered symbol, and tagline, and uses the Big-LaMa TorchScript model to
reconstruct the original background. Product source images are never edited.

The tensor preparation follows the open-source simple-lama-inpainting wrapper
(MIT) and the underlying LaMa project:
https://github.com/enesmsahin/simple-lama-inpainting
https://github.com/advimman/lama
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import urlparse

import numpy as np
import torch
from PIL import Image, ImageDraw, ImageFilter
from torch.hub import download_url_to_file, get_dir


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_URL = (
    "https://github.com/enesmsahin/simple-lama-inpainting/releases/"
    "download/v0.1.0/big-lama.pt"
)
MODEL_SHA256 = "7ba7aa7ac37a4d41fdbbeba3a2af7ead18058552997e3a3cd1a3b2210c9e6b4c"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def resolve_model(explicit_path: str | None) -> Path:
    if explicit_path:
        model_path = Path(explicit_path).resolve()
    elif os.environ.get("LAMA_MODEL"):
        model_path = Path(os.environ["LAMA_MODEL"]).resolve()
    else:
        model_dir = Path(get_dir()) / "checkpoints"
        model_dir.mkdir(parents=True, exist_ok=True)
        model_path = model_dir / Path(urlparse(MODEL_URL).path).name
        if not model_path.exists():
            download_url_to_file(MODEL_URL, str(model_path), progress=True)

    if not model_path.is_file():
        raise FileNotFoundError(f"Big-LaMa model not found: {model_path}")
    actual_hash = sha256(model_path)
    if actual_hash != MODEL_SHA256:
        raise RuntimeError(
            "Big-LaMa model hash mismatch: "
            f"expected {MODEL_SHA256}, received {actual_hash}"
        )
    return model_path


def pad_to_multiple(array: np.ndarray, multiple: int = 8) -> np.ndarray:
    _, height, width = array.shape
    padded_height = ((height + multiple - 1) // multiple) * multiple
    padded_width = ((width + multiple - 1) // multiple) * multiple
    return np.pad(
        array,
        ((0, 0), (0, padded_height - height), (0, padded_width - width)),
        mode="symmetric",
    )


class LamaInpainter:
    def __init__(self, model_path: Path) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = torch.jit.load(str(model_path), map_location=self.device)
        self.model.eval()
        self.model.to(self.device)

    def __call__(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        original_width, original_height = image.size
        image_array = np.asarray(image, dtype=np.float32).transpose(2, 0, 1) / 255
        mask_array = np.asarray(mask, dtype=np.float32)[np.newaxis, ...] / 255
        image_tensor = torch.from_numpy(pad_to_multiple(image_array)).unsqueeze(0)
        mask_tensor = torch.from_numpy(pad_to_multiple(mask_array)).unsqueeze(0)
        image_tensor = image_tensor.to(self.device)
        mask_tensor = (mask_tensor.to(self.device) > 0).to(torch.float32)

        with torch.inference_mode():
            inpainted = self.model(image_tensor, mask_tensor)

        result = inpainted[0].permute(1, 2, 0).detach().cpu().numpy()
        result = np.clip(result[:original_height, :original_width] * 255, 0, 255)
        return Image.fromarray(result.astype(np.uint8), mode="RGB")


def legacy_mask(image_size: tuple[int, int], region: dict[str, int]) -> Image.Image:
    width = region["width"]
    height = region["height"]
    red_width = width / 2
    red_height = height / 4.3
    red_left = region["left"] + red_width * 0.45
    red_right = red_left + red_width
    red_top = region["top"] + red_height
    red_bottom = red_top + red_height

    mask = Image.new("L", image_size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (
            round(red_left - red_width * 0.3),
            round(red_top - red_height * 0.78),
            round(red_right + red_width * 0.42),
            round(red_bottom + red_height * 0.62),
        ),
        fill=255,
    )
    draw.rounded_rectangle(
        (
            round(red_left - red_width * 0.24),
            round(red_bottom + red_height * 0.42),
            round(red_right + red_width * 0.42),
            round(red_bottom + red_height * 1.2),
        ),
        radius=max(2, round(red_height * 0.1)),
        fill=255,
    )
    return mask.filter(ImageFilter.MaxFilter(5))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--input-root", required=True)
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--model")
    parser.add_argument("--resume", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest_path = Path(args.manifest).resolve()
    input_root = Path(args.input_root).resolve()
    output_root = Path(args.output_root).resolve()
    if input_root == output_root:
        raise RuntimeError("Refusing to overwrite the source product image directory")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    legacy_records = [
        record
        for record in manifest["files"]
        if record.get("placement", {}).get("strategy") == "legacy-repair"
    ]
    inpainter = LamaInpainter(resolve_model(args.model))
    completed = 0

    for index, record in enumerate(legacy_records, start=1):
        source_path = (PROJECT_ROOT / record["source"]).resolve()
        relative_path = source_path.relative_to(input_root)
        output_path = (output_root / relative_path).resolve()
        output_path.relative_to(output_root)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if args.resume and output_path.is_file():
            completed += 1
            print(f"[{index}/{len(legacy_records)}] resume {relative_path.as_posix()}")
            continue

        image = Image.open(source_path).convert("RGB")
        mask = legacy_mask(image.size, record["repair"]["region"])
        repaired = inpainter(image, mask)
        repaired.save(output_path, "WEBP", quality=92, method=5)
        completed += 1
        print(f"[{index}/{len(legacy_records)}] inpaint {relative_path.as_posix()}")

    audit = {
        "schemaVersion": 1,
        "model": {
            "name": "big-lama.pt",
            "sha256": MODEL_SHA256,
            "source": MODEL_URL,
        },
        "sourceManifest": os.path.relpath(manifest_path, PROJECT_ROOT).replace("\\", "/"),
        "count": completed,
    }
    (output_root / "inpaint-manifest.json").write_text(
        json.dumps(audit, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Prepared {completed} deep-inpainted legacy-logo sources in {output_root}")


if __name__ == "__main__":
    main()
