# Status Report 2/6
## Team Report
#### Previous Goals
We want to finish setting up the basic framework of our project and begin working on the testing and CI elements of the project.
#### Progress
We set up a rudimentary testing framework, added the sections to the Living Doc, and submitted the assigment. Rough versions of the docs for the controller exist, and implementation of the front end continues.
#### New Goals


## Individual Reports

### Dylan Frohberg
#### Previous Goals
I need to finish my implementation of the basics of the NLP set up and start working on the testing suite.
#### Progress
I participated in the discussions about CI and testing and wrote up a couple of parts for the Living Doc. I was the one who added Pytest to the environment as well as created the test folder and a cursory test of the controller (which admittedly just automatically passses). I also wrote up the doc and method headers for the controller now that we have settled upon the design which we are using. Overall I think this was a good return to form, considering that I was sick the previous week and did not contribute as much as I would have liked to.
#### New Goals
I need to add the controller and test to the README as well as finish implementing the FeatureExtractor component. I also plan to help on the assignment for the next week.

### Alex Hugli
-Got role of acquiring/generating data, as well as front and back end linking
-Found data set (1.7mn)
-Got API access and figured out formats to be used in training (txt, pdf)

#### Previous Goals
-Find a file set of essays, or an easily-formatted database/repository of essays (perhaps dissertations?)
-Utilize the GPT-3 API and design a routine that generates cheap, fairly complex machine-generated essays
#### Progress
-Found a 1.7 million essay database: https://www.kaggle.com/datasets/Cornell-University/arxiv?resource=download
-Living document updated with more specification
-Got GPT-3 Playground API access
-Explored possible file formats (PDF, markdown etc.) and conversion to plaintext format
#### New Goals
-Automate the acquisition of essays from the arXiv dataset using the format/process: 
    1. Acquire ID
    2. Visit "https://arxiv.org/abs/ + ID"
    3. Download PDF
    4. Store/organize
    ...
    5+. Process data
-Write the code for generating machine-generated documents using GPT-3 AI
    1. Get a fully functional setup going where I can run a program and generate text to an archivable file
    2. Test several hundred iterations and build the archive of machine-generated documents
-Pay GPT-3 Playground bill

### Phuong Duy Nguyen

#### Previous Goals
    - Explore which ML based approaches can work for this problem, maybe there are non neural network approaches like SVM or k-means that could work.

#### Progress
    - Contributed to this week's assignment and Living Document:
        - Detailed risks and assement of risks
        - Added Coding Guidelines
        - Reorganized Living document to update to new assignment
    - Determined that 
    - Started a Google Colab to implement text perplexity and bursiness calculation
    - Explored various ML models that can fit the project:
        - OpenAI's Roberta base model to detect GPT-2's output, can be found on HuggingFace
        - Using the Giant Language model Test Room (GLTR) tool

#### New Goals
    - Finish the implementation for text perplexity and bursiness calculation
    - Discuss and finalize chosen ML model for the project
    - Get started on implementing the chosen ML model (reimplemtation of existing model or integration using an API).

### Simon Struthers

#### Previous Goals
1. Figure out where and how to host our website in the cloud.
2. Get started on React front-end & code.
3. Make launching a local test server more convenient.

#### Progress
- Got started with document submission form
- Created utility hook to store user's progress and view prior requests/inquiries between site visits.

#### New Goals
1. Create adequate styling for UI elements
2. Create manual document submission form
3. Prototype in-progress and completed submission list

### Muhammad Ammar

#### Previous Goals

Familiarize myself with openAI and huggingface APIs and use them to request essays.

### Progress
I was able to generate essays through openAI API and learnt to use inference API from hugginface if we need to use a model from there.

### New Goals
Think of ways to compare AI generated and human written essays. We will need some factors and reward system to compare two essays and find similarities in them.