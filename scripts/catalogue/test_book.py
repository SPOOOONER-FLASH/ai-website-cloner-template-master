import re, sys, tempfile, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pymupdf
from catalogue import book, heroes, qr, style

COMPANY = "Canton Hyland Hardware & Building Material Co., Ltd."
CJK = re.compile(r"[\u3400-\u9fff]")

class BookTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        d = Path(tempfile.mkdtemp())
        cls.el = pymupdf.open(book.render(book.ELECTRONIC, d / "e.pdf"))
        cls.pr = pymupdf.open(book.render(book.PRINT, d / "p.pdf"))
        cls.text = {k: [p.get_text() for p in doc] for k, doc in (("el", cls.el), ("pr", cls.pr))}

    def test_print_fits_the_budget_and_binds(self):
        self.assertLessEqual(self.pr.page_count, 70)
        self.assertEqual(self.pr.page_count % 4, 0)

    def test_electronic_has_an_even_page_count(self):
        self.assertEqual(self.el.page_count % 2, 0, self.el.page_count)

    def test_no_published_product_is_dropped(self):
        models = {str(p["model"]) for f in heroes.families() for p in f.products}
        for k in ("el", "pr"):
            body = " ".join(" ".join(self.text[k]).split())  # a model may wrap across two lines
            missing = sorted(m for m in models if " ".join(m.split()) not in body)
            self.assertEqual(missing, [], k)

    def test_index_pages_are_right(self):
        jobs, _ = book.plan(book.PRINT)
        from catalogue import variants
        for model, page in book._index_entries(jobs):
            text = " ".join(self.text["pr"][page - 1].split())
            base = variants.split_finish(model)[0]
            self.assertTrue(model in text or base in text, f"{model} -> p{page}")

    def test_company_name_and_honesty(self):
        for k in ("el", "pr"):
            body = "\n".join(self.text[k])
            self.assertIn(COMPANY, body)
            for word in ("ISO 9001", "certified", "TÜV", "UL listed"):
                self.assertNotIn(word, body, k)
            self.assertIsNone(CJK.search(body), k)

    def test_print_geometry(self):
        for page in self.pr:
            self.assertAlmostEqual(page.trimbox.width, 595.276, places=1)
            self.assertAlmostEqual(page.bleedbox.width, 595.276 + 2 * style.BLEED, places=1)

    def test_electronic_links_each_family_online(self):
        uris = {l.get("uri") for p in self.el for l in p.get_links()}
        for f in heroes.families():
            self.assertIn(qr.family_url(f.slug), uris)

    def test_no_photo_set_is_exact_and_not_drawn_as_cards(self):
        self.assertEqual(book.NO_PHOTO, {"D-1042", "D-1043", "D-3017", "D-3018"})
        _, fams = book.plan(book.PRINT)
        shown = {c.model for fl in fams for c in fl.cards}
        self.assertTrue(book.NO_PHOTO.isdisjoint(shown))

if __name__ == "__main__":
    unittest.main()
