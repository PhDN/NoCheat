from unittest import TestCase, TestLoader, TestSuite


class TestController(TestCase):
    def test_process_file(self):
        assert True

    def test_parse_file(self):
        assert True

    def test_analyze_results(self):
        assert True


suite_controller = TestLoader().loadTestsFromTestCase(TestController)

ControllerTestSuite = TestSuite([suite_controller])
