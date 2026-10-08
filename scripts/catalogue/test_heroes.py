import json, sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from PIL import Image
from catalogue import heroes

class HeroesTest(unittest.TestCase):
    def test_seventeen_families_with_the_measured_counts(self):
        fams = heroes.families()
        self.assertEqual(len(fams), 17)
        self.assertEqual(sum(len(f.products) for f in fams), 616)
        self.assertEqual(sum(len(f.photographed) for f in fams), 549)

    def test_every_family_has_a_hero_that_prints_sharp(self):
        for fam in heroes.families():
            if fam.slug in heroes.PENDING_HERO:
                continue
            _, path = heroes.hero_for(fam)
            with Image.open(path) as im:
                self.assertGreaterEqual(max(im.size), heroes.HERO_MIN_PX, fam.slug)

    def test_the_pending_list_is_exactly_the_known_gap(self):
        self.assertEqual(heroes.PENDING_HERO, {"floor-springs-and-pivots"})
        fam = next(f for f in heroes.families() if f.slug == "floor-springs-and-pivots")
        with self.assertRaises(LookupError):
            heroes.hero_for(fam)

    def test_heroes_are_hi_res_cut_outs_never_as_shot(self):
        # As-shot plates skip cutOut(), so they still carry the supplier's burned-in
        # watermark. A family opener cannot.
        report = json.loads((heroes.HI_PLATES / "index.json").read_text("utf8"))
        for fam in heroes.families():
            if fam.slug in heroes.PENDING_HERO:
                continue
            _, path = heroes.hero_for(fam)
            self.assertIn("catalogue-plates-hi", str(path))
            self.assertEqual(report[path.stem], "cut-out", fam.slug)

if __name__ == "__main__":
    unittest.main()
