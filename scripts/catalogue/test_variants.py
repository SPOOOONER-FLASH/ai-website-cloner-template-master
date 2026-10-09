import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from catalogue import variants

def P(model, name="Deadbolt", **specs):
    return {"model": model, "name": name, "specs": [{"label": k, "value": v} for k, v in specs.items()]}

class VariantsTest(unittest.TestCase):
    def test_finish_variants_merge_into_one_card(self):
        cards = variants.cards([P("D101 AB", Throw="25mm"), P("D101 AC", Throw="25mm"),
                                P("D101 PB", Throw="25mm"), P("D101 SS", Throw="25mm")])
        self.assertEqual(len(cards), 1)
        self.assertEqual(cards[0].model, "D101")
        self.assertEqual(cards[0].finishes, ["AB", "AC", "PB", "SS"])

    def test_different_specs_do_not_merge(self):
        cards = variants.cards([P("D101 AB", Throw="25mm"), P("D101 SS", Throw="30mm")])
        self.assertEqual(len(cards), 2)

    def test_finish_rows_do_not_block_a_merge(self):
        cards = variants.cards([P("D101 AB", Throw="25mm", Finish="Antique brass"),
                                P("D101 SS", Throw="25mm", Finish="Stainless")])
        self.assertEqual(len(cards), 1)

    def test_a_bare_model_joins_its_variants(self):
        cards = variants.cards([P("1073D", Throw="25mm"), P("1073D MB", Throw="25mm")])
        self.assertEqual(len(cards), 1)
        self.assertEqual(cards[0].finishes, ["—", "MB"])

    def test_nothing_is_lost(self):
        ps = [P("A1"), P("A1 SS"), P("B2"), P("C3 AB", Throw="1"), P("C3 SN", Throw="2")]
        self.assertEqual(sum(len(c.members) for c in variants.cards(ps)), len(ps))

if __name__ == "__main__":
    unittest.main()
