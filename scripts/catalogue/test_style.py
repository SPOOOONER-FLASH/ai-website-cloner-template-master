import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from catalogue import style

class StyleTest(unittest.TestCase):
    def test_trim_is_a4_and_bleed_is_3mm(self):
        self.assertAlmostEqual(style.TRIM.width, 595.276, places=2)
        self.assertAlmostEqual(style.TRIM.height, 841.890, places=2)
        self.assertAlmostEqual(style.BLEED, 8.504, places=2)

    def test_every_font_loads_and_is_archivo(self):
        for key in ("text", "text-medium", "text-semibold", "text-bold", "display", "display-semibold"):
            self.assertIn("Archivo", style.FONTS[key].name, key)

    def test_archivo_covers_the_characters_specs_use(self):
        for ch in "—–×°Ø±½¼":
            self.assertTrue(style.has_glyph("text", ch), repr(ch))

    def test_fallback_covers_what_archivo_does_not(self):
        for ch in "≤≥":
            self.assertTrue(style.has_glyph("fallback", ch), repr(ch))

    def test_fit_trims_with_an_ellipsis_and_never_exceeds_width(self):
        out = style.fit("Stainless steel lever handle with return spring", 60, 9, "text")
        self.assertTrue(out.endswith("…"))
        self.assertLessEqual(style.FONTS["text"].text_length(out, 9), 60)
        self.assertEqual(style.fit("Short", 200, 9, "text"), "Short")

    def test_dpi_guard(self):
        self.assertAlmostEqual(style.max_print_width(1000, 200), 360.0)

if __name__ == "__main__":
    unittest.main()
