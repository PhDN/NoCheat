from werkzeug.datastructures import FileStorage
from PyPDF2 import PdfFileReader
from model import GPT2PPL
import magic #, docx

def parse_file(file: FileStorage) -> str:
    """
    Takes a text file and moves text into data structure.
    :param file: File to be parsed, must be a document
    :raises IOError when file is not a document file
    :return: A string containing the text from the document
    """
    text = ""
    filetype = magic.from_buffer(file.stream.read(2048), mime = True)
    file.stream.seek(0)
    if filetype == "text/plain":
        text = file.stream.read()
    elif filetype == "application/pdf":
        reader = PdfFileReader(file.stream)
        for page in reader.pages:
            text = text + page.extractText()
#     elif filetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
#         doc = docx.Document(file.stream)
#         for p in doc.paragraphs:
#             text = text + p.text
    else:
        raise IOError(f"Invalid file type {filetype}. File must be plaintext or a PDF.")

    return text


class Controller:
    """
    The controller processes users input from the website and uses it to update the model, and the website in turn.

    This is meant to integrate the backend of the website and the data model.
    It receives files from the website, which it converts into text data, and
    then extracts features from those. Those are then fed into the model, and the
    results are then analyzed and converted into data which is returned to the
    website backend so that it can be displayed.
    """

    __instance = None

    @staticmethod
    def get_instance():
        if Controller.__instance is None:
            Controller()
        return Controller.__instance

    def __init__(self):
        Controller.__instance = self
    
    def process_text(self, text: str):
        """
        Takes a string and returns the results of human-AI check
        :param file:
        :raises Exception
        :return:
        """
        return GPT2PPL()(text) # Model step where checks if text AI or not

    def process_file(self, file: FileStorage):
        """
        Takes a text file and returns the results of human-AI check
        :param file:
        :raises Exception
        :return:
        """
        return self.analyze_results(process_text(parse_file(file)))

    def analyze_results(self, results):
        """
        Converts the raw results into data to be displayed on frontend
        :param results:
        :return:
        """
        return results[0]["label"]
