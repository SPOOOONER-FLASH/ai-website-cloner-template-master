import sys, tempfile, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pymupdf
from catalogue import samples, style

COMPANY = "Canton Hyland Hardware & Building Material Co., Ltd."

class SamplesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        d = Path(tempfile.mkdtemp())
        cls.screen = pymupdf.open(samples.render(d / "s.pdf", print_mode=False))
        cls.press = pymupdf.open(samples.render(d / "p.pdf", print_mode=True))

    def test_four_pages_each(self):
        self.assertEqual(self.screen.page_count, 4)
        self.assertEqual(self.press.page_count, 4)

    def test_screen_is_trim_size(self):
        self.assertAlmostEqual(self.screen[0].rect.width, 595.276, places=1)
        self.assertAlmostEqual(self.screen[0].rect.height, 841.890, places=1)

    def test_print_has_trimbox_a4_and_bleedbox_3mm(self):
        for page in self.press:
            self.assertAlmostEqual(page.trimbox.width, 595.276, places=1)
            self.assertAlmostEqual(page.bleedbox.width, 595.276 + 2 * style.BLEED, places=1)
            self.assertGreater(page.mediabox.width, page.bleedbox.width)  # room for crop marks

    def test_fonts_embedded_are_archivo(self):
        names = {f[3] for p in self.screen for f in p.get_fonts(full=True)}
        self.assertTrue(any("Archivo" in n for n in names), names)

    def test_text_layer_has_the_exact_company_name(self):
        text = "".join(p.get_text() for p in self.screen)
        self.assertIn(COMPANY, text)
        self.assertNotIn("Canton Hyland Hardware Co., Ltd.", text)

    def test_no_certification_claimed(self):
        text = "".join(p.get_text() for p in self.screen).lower()
        for word in ("iso 9001", "certified", "tüv", "ce mark", "ul listed"):
            self.assertNotIn(word, text)

    def test_product_page_shows_nine_models_main_products_first(self):
        fam = next(f for f in samples.heroes.families() if f.slug == "panic-exit-devices")
        items = samples.ordered(fam)[:9]
        text = self.screen[3].get_text()
        for p in items:
            self.assertIn(str(p["model"]), text)
        trims = [p for p in fam.photographed if "Trim" in p.get("name", "")]
        mains = [p for p in fam.photographed if "Trim" not in p.get("name", "")]
        if len(mains) >= 9:
            self.assertFalse(any("Trim" in p.get("name", "") for p in items))

if __name__ == "__main__":
    unittest.main()
