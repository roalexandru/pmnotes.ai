import unittest

# The function to test (normally imported from your module)
def calculate_tier(usage):
    if not isinstance(usage, (int, float)):
        raise ValueError("Usage must be numeric")
    if usage < 0:
        raise ValueError("Usage must be non-negative")
    if usage < 100:
        return "Free"
    if usage < 1000:
        return "Pro"
    return "Enterprise"


class TestSubscriptionTiers(unittest.TestCase):
    def test_free_tier_boundaries(self):
        self.assertEqual(calculate_tier(0), "Free")
        self.assertEqual(calculate_tier(99), "Free")

    def test_pro_tier_boundaries(self):
        self.assertEqual(calculate_tier(100), "Pro")
        self.assertEqual(calculate_tier(999), "Pro")

    def test_enterprise_tier_boundary(self):
        self.assertEqual(calculate_tier(1000), "Enterprise")

    def test_invalid_negative_usage(self):
        with self.assertRaises(ValueError):
            calculate_tier(-1)

    def test_invalid_non_numeric_usage(self):
        with self.assertRaises(ValueError):
            calculate_tier("lots")


if __name__ == "__main__":
    unittest.main()
