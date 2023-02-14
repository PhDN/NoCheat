from werkzeug.datastructures import FileStorage
from PyPDF2 import PdfFileReader
from model import GPT2PPL
import docx

ALLOWED_EXTENSIONS = {'txt', 'docx', 'pdf'}


def file_type(filename: str) -> str:
    """
    :param filename A string with the name of the file
    :raise: IOError if the file is not one of the allowed filetypes
    :return: A string with the file extension
    """
    if '.' in filename:
        extension = filename.rsplit('.', 1)[1].lower()
        if extension in ALLOWED_EXTENSIONS:
            return extension
    raise IOError("Not a text file. Input must be a txt, pdf, or docx file.")


def parse_file(file: FileStorage):
    """
    Takes a text file and moves text into data structure.
    :param file: File to be parsed, must be a document
    :raises IOError when file is not a document file
    :return: A string containing the text from the document
    """
    try:
        filetype = file_type(file.filename)
    except IOError:
        pass
    text = ""
    if filetype == "txt":
        text = file.stream.read()
    elif filetype == "pdf":
        reader = PdfFileReader(file.stream.read())
        for page in reader.pages:
            text = text + page.extractText()
    else:
        doc = docx.Document(file.stream)
        for p in doc.paragraphs:
            text = text + p.text
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

    def __new__(cls):
        """
        Returns the controller object, of which there is only one instance.
        """
        if not hasattr(cls, 'instance'):
            cls.instance = super(Controller, cls).__new__(cls)
        return cls.instance

    def process_file(self, file: FileStorage):
        """
        Takes a text file and returns the results of human-AI check
        :param file:
        :raises Exception
        :return:
        """
        text = parse_file(file)
        # initialize the model
        model = GPT2PPL()
        # Feature extraction where convert text to relevant data
        result = model(text) # Model step where checks if text AI or not
        
        return result

    def analyze_results(self, results):
        """
        Converts the raw results into data to be displayed on frontend
        :param results:
        :return:
        """
        return results[0]["label"]
