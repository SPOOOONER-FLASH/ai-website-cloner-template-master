"""Compare all file contents and link targets without following directory links."""
import concurrent.futures
import hashlib
import json
import os
import stat
import sys
from pathlib import Path


def extended(path):
    absolute = os.path.abspath(path)
    if os.name == "nt" and not absolute.startswith("\\\\?\\"):
        return "\\\\?\\" + absolute
    return absolute


def inventory(root):
    result = {}
    stack = [(extended(root), "")]
    while stack:
        directory, prefix = stack.pop()
        with os.scandir(directory) as entries:
            for entry in entries:
                relative = prefix + entry.name
                info = entry.stat(follow_symlinks=False)
                if info.st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT:
                    result[relative] = ("link", os.readlink(entry.path))
                elif stat.S_ISDIR(info.st_mode):
                    result[relative] = ("directory",)
                    stack.append((entry.path, relative + "/"))
                else:
                    result[relative] = ("file", info.st_size, info.st_mtime_ns)
    return result


def digest(path):
    with open(extended(path), "rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def main():
    if sys.argv[1] == "--links":
        root = Path(sys.argv[2])
        links = []
        for name, info in inventory(root).items():
            if info[0] == "link":
                path = extended(root / name)
                links.append({"relative": name, "target": info[1],
                              "kind": "Junction" if os.path.isjunction(path) else "SymbolicLink",
                              "directory": bool(os.lstat(path).st_file_attributes & stat.FILE_ATTRIBUTE_DIRECTORY)})
        print(json.dumps(links), flush=True)
        return 0
    source, target, report = map(Path, sys.argv[1:4])
    allow_target_extras = "--allow-target-extras" in sys.argv[4:]
    if report.name.startswith("cutover-"):
        prior = report.with_name(report.name.replace("cutover-", "verify-", 1) + ".inventory.json")
        if prior.exists():
            saved = json.loads(prior.read_text(encoding="utf-8"))
            source_expected = {name: tuple(info) for name, info in saved["source"].items()}
            target_expected = {name: tuple(info) for name, info in saved["target"].items()}
            errors = []
            if inventory(source) != source_expected:
                errors.append("Source changed since successful SHA256 verification")
            if inventory(target) != target_expected:
                errors.append("Destination changed since successful SHA256 verification")
            result = {"source": str(source), "target": str(target),
                      "sha256_verified": not errors,
                      "method": "successful SHA256 verification plus unchanged full inventory at cutover",
                      "errors": errors}
            report.write_text(json.dumps(result, indent=2), encoding="utf-8")
            print(json.dumps(result), flush=True)
            return 1 if errors else 0
    before = inventory(source)
    destination = inventory(target)
    errors = []
    if set(before) - set(destination) or (not allow_target_extras and set(destination) - set(before)):
        errors.append({"missing": sorted(set(before) - set(destination))[:20],
                       "extra": [] if allow_target_extras else sorted(set(destination) - set(before))[:20]})
    files = [name for name, info in before.items() if info[0] == "file"]

    def check(name):
        expected = before[name]
        actual = destination.get(name)
        if actual is None or actual[0:2] != expected[0:2]:
            return name
        try:
            if digest(source / name) != digest(target / name):
                return name
            current = os.stat(extended(source / name))
            if (current.st_size, current.st_mtime_ns) != expected[1:]:
                return name + " (source changed during verification)"
        except OSError as exc:
            return name + " (" + str(exc) + ")"
        return None

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        for error in executor.map(check, files):
            if error:
                errors.append(error)
    for name, info in before.items():
        if info[0] != "file" and destination.get(name) != info:
            errors.append(name + " (directory/link differs)")
    if before != inventory(source):
        errors.append("Source tree changed during verification")
    if destination != inventory(target):
        errors.append("Destination tree changed during verification")
    result = {"source": str(source), "target": str(target), "files": len(files),
              "bytes": sum(before[name][1] for name in files),
              "links": sum(info[0] == "link" for info in before.values()),
              "sha256_verified": not errors, "errors": errors[:25]}
    report.write_text(json.dumps(result, indent=2), encoding="utf-8")
    if not errors:
        Path(str(report) + ".inventory.json").write_text(
            json.dumps({"source": before, "target": destination}), encoding="utf-8")
    print(json.dumps(result), flush=True)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
