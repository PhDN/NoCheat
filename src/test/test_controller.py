from unittest import TestCase, TestLoader, TestSuite
from werkzeug.datastructures import FileStorage
from src.back import Controller as c

testText = "Lorem ipsum dolor sit amet"


class TestController(TestCase):

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
        with open("src/test/data/lipsum.doc", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.doc", content_type="application/msword")
            self.assertEquals(testText, c.parse_file(file))

    def test_parse_fileOdt(self):
        with open("src/test/data/lipsum.odt", 'rb') as t:
            file = FileStorage(stream=t, filename="data/lipsum.odt", content_type="application/vnd.oasis.opendocument.text")
            self.assertEquals(testText, c.parse_file(file))

    def test_analyze_results(self):
        assert True

    def test_process_fileHuman(self):
        control = c.Controller.get_instance()
        with open("src/test/data/human_generated_text.txt", 'rb') as t:
            file = FileStorage(stream=t, filename="data/human_generated_text.txt", content_type="text/plain")
            self.assertEquals(1, control.process_file(file))
        with open("src/test/data/human_generated_text.pdf", 'rb') as t:
            file = FileStorage(stream=t, filename="data/human_generated_text.pdf", content_type="application/pdf")
            self.assertEquals(1, control.process_file(file))
        # with open("src/test/data/human_generated_text.docx", 'rb') as t:
        #     file = FileStorage(stream=t, filename="data/human_generated_text.docx", content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        #     self.assertEquals(1, control.process_file(file))
        with open("src/test/data/human_generated_text.doc", 'rb') as t:
            file = FileStorage(stream=t, filename="data/human_generated_text.doc", content_type="application/msword")
            self.assertEquals(1, control.process_file(file))


    def test_process_fileAI(self):
        control = c.Controller.get_instance()
        with open("src/test/data/chat-gpt_generated_text.txt", 'rb') as t:
            file = FileStorage(stream=t, filename="data/chat-gpt_generated_text.txt", content_type="text/plain")
            self.assertEquals(0, control.process_file(file))
        # with open("src/test/data/chat-gpt_generated_text.pdf", 'rb') as t:
        #     file = FileStorage(stream=t, filename="data/chat-gpt_generated_text.pdf", content_type="application/pdf")
        #     self.assertEquals(0, control.process_file(file))
        with open("src/test/data/chat-gpt_generated_text.docx", 'rb') as t:
            file = FileStorage(stream=t, filename="data/chat-gpt_generated_text.docx", content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            self.assertEquals(0, control.process_file(file))
        # with open("src/test/data/chat-gpt_generated_text.doc", 'rb') as t:
        #     file = FileStorage(stream=t, filename="data/chat-gpt_generated_text.doc", content_type="application/msword")
        #     self.assertEquals(0, control.process_file(file))


suite_controller = TestLoader().loadTestsFromTestCase(TestController)

ControllerTestSuite = TestSuite([suite_controller])
