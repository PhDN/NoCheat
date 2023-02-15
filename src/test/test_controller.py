from unittest import TestCase, TestLoader, TestSuite
from werkzeug.datastructures import FileStorage
from src.back import Controller as c

testText = "Lorem ipsum dolor sit amet"


class TestController(TestCase):
    def test_process_file(self):
        assert True

    def test_parse_fileTxt(self):
        with open("data/lipsum.txt") as t:
            file = FileStorage(stream=t, filename="data/lipsum.txt")
            self.assertEquals(testText, c.parse_file(file))

    def test_analyze_results(self):
        assert True


suite_controller = TestLoader().loadTestsFromTestCase(TestController)

ControllerTestSuite = TestSuite([suite_controller])
