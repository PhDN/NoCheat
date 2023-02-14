from model import GPT2PPL
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

    def process_file(self, file):
        """
        Takes a text file and returns the results of human-AI check
        :param file:
        :return:
        """
        text = self.parse_file(file)

        # initialize the model
        model = GPT2PPL()
        # Feature extraction where convert text to relevant data
        result = model(text) # Model step where checks if text AI or not
        
        return self.analyze_results(result)

    def parse_file(self, file):
        """
        Takes a text file and moves text into data structure.
        :param file:
        :return:
        """

        #open text file in read mode
        text_file = open("D:/data.txt", "r")
        #read whole file to a string
        text = text_file.read()
        #close file
        text_file.close()
        
        print(text)

    def analyze_results(self, results):
        """
        Converts the raw results into data to be displayed on frontend
        :param results:
        :return:
        """
        return None
