import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pymupdf, segno
from catalogue import qr

class QrTest(unittest.TestCase):
    def test_url_shape(self):
        self.assertEqual(qr.family_url("lever-handles"), "https://cantonlock.com/products/lever-handles/")

    def test_draws_exactly_the_dark_modules_segno_encodes(self):
        url = qr.family_url("lever-handles")
        expected = sum(sum(1 for v in row if v) for row in segno.make(url, error="m").matrix)
        doc = pymupdf.open(); page = doc.new_page()
        drawn = qr.draw_qr(page, pymupdf.Rect(100, 100, 172, 172), url)
        self.assertEqual(drawn, expected)

    def test_is_vector_not_raster(self):
        doc = pymupdf.open(); page = doc.new_page()
        qr.draw_qr(page, pymupdf.Rect(100, 100, 172, 172), qr.family_url("deadbolts"))
        self.assertEqual(page.get_images(), [])
        self.assertGreater(len(page.get_drawings()), 0)

if __name__ == "__main__":
    unittest.main()
