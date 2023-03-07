from unittest import TestCase, TestLoader, TestSuite
from werkzeug.datastructures import FileStorage
from src.back import Controller as c

testText = "Lorem ipsum dolor sit amet"


class TestController(TestCase):
    def test_process_file(self):
        assert True

    def test_parse_fileTxt(self):
        with open("src/test/data/lipsum.txt", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.txt", content_type="text/plain")
            self.assertEquals(testText, c.parse_file(file))

    def test_parse_filePdf(self):
        with open("src/test/data/lipsum.pdf", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.pdf", content_type="application/pdf")
            self.assertEquals(testText, c.parse_file(file))

    def test_parse_fileDocx(self):
        with open("src/test/data/lipsum.docx", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.docx", content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            self.assertEquals(testText, c.parse_file(file))

    def test_parse_fileDoc(self):
        with open("data/lipsum.doc", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.doc", content_type="application/msword")
            self.assertEquals(testText, c.parse_file(file))

    def test_parse_fileOdt(self):
        with open("data/lipsum.odt", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.odt", content_type="application/vnd.oasis.opendocument.text")
            self.assertEquals(testText, c.parse_file(file))

    def test_analyze_results(self):
        assert True


suite_controller = TestLoader().loadTestsFromTestCase(TestController)

ControllerTestSuite = TestSuite([suite_controller])
