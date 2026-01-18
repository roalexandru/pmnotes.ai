import unittest

# The function to test (normally imported from your module)
def calculate_tier(usage):
    if usage < 100:
        return 'Free'
    elif usage < 1000:
        return 'Pro'
    else:
        return 'Enterprise'

class TestSubscriptionTiers(unittest.TestCase):

    def test_free_tier(self):
        # Case: Usage is well below threshold
        self.assertEqual(calculate_tier(50), 'Free')
        # Case: Boundary condition (99 should be Free)
        self.assertEqual(calculate_tier(99), 'Free')

    def test_pro_tier(self):
        # Case: Exact boundary
        self.assertEqual(calculate_tier(100), 'Pro')
        # Case: Mid-range
        self.assertEqual(calculate_tier(500), 'Pro')
        # Case: Upper boundary
        self.assertEqual(calculate_tier(999), 'Pro')

    def test_enterprise_tier(self):
        # Case: Exact boundary
        self.assertEqual(calculate_tier(1000), 'Enterprise')
        # Case: Very high usage
        self.assertEqual(calculate_tier(50000), 'Enterprise')

if __name__ == '__main__':
    unittest.main()
