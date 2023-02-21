from werkzeug.datastructures import FileStorage
from PyPDF2 import PdfFileReader
from model import GPT2PPL
import magic
import docx
import tempfile

DOC_FILETYPES = {"application/vnd.openxmlformats-officedocument.wordprocessingml.document"} #,
                 #"application/msword", "application/vnd.oasis.opendocument.text"}


def parse_file(file: FileStorage) -> str:
    """
    Takes a text file and moves text into data structure.
    :param file: File to be parsed, must be a document (TXT, PDF, or DOCX)
    :raises IOError when file is not a document file
    :return: A string containing the text from the document
    """
    text = ""
    filetype = magic.from_buffer(file.stream.read(2048), mime = True)
    file.stream.seek(0)
    if filetype == "text/plain":
        text = file.stream.read().decode('utf-8')
    elif filetype == "application/pdf":
        reader = PdfFileReader(file.stream)
        for page in reader.pages:
            text = text + page.extractText()
        text = text.strip()
    elif filetype in DOC_FILETYPES:
        tmp = tempfile.NamedTemporaryFile()
        tmp.write(file.stream.read())
        doc = docx.Document(tmp.name)
        for p in doc.paragraphs:
            text = text + p.text
    else:
        raise IOError(f"Invalid file type {filetype}. File must be plaintext, DOCX, or a PDF.")

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
        """
        Returns the Controller so that user can access.
        """
        if Controller.__instance is None:
            Controller()
        return Controller.__instance

    def __init__(self):
        Controller.__instance = self
    
    def process_text(self, text: str):
        """
        Takes a string and returns the results of human-AI check
        :param text: A string which is to be analyzed
        :return: Results of analysis
        """
        return GPT2PPL()(text) # Model step where checks if text AI or not

    def process_file(self, file: FileStorage):
        """
        Takes a text file and returns the results of human-AI check
        :param file: The file to be processed
        :raises IOError if the file is not one of the accepted types (TXT, DOCX, PDF)
        :return: The analysis results formatted for usage by frontend.
        """
        return self.analyze_results(self.process_text(parse_file(file)))

    def analyze_results(self, results):
        """
        Converts the raw results into data to be displayed on frontend
        :param results: The raw result data from the model
        :return: The data in format usable by front end
        """
        return results[0]["label"]
