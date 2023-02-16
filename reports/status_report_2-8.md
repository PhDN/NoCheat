# Status Report 2/8
## Team Report
#### Previous Goals
We want to finish setting up the basic framework of our project and begin working on the testing and CI elements of the project.
#### Progress
We set up a rudimentary testing framework, added the sections to the Living Doc, and submitted the assigment. Rough versions of the docs for the controller exist, and implementation of the front end continues.
#### New Goals
We want to have a working beta by 2/14, and should have revised the Living Doc for submission with it. We also need to make the slides for the presentation.

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
    - Finish the implementation for text perplexity and bursiness calculation
    - Discuss and finalize chosen ML model for the project
    - Get started on implementing the chosen ML model (reimplemtation of existing model or integration using an API).

#### Progress
    - Contributed to this week's assignment and Living Document:
        - Help outline testing plan for backend infrastructure
    - Finish the implementation of text perplexity and bursiness calculation using OpenAi's GPT-2 model via HuggingFace API. This will serve as a core competency for the project to meet the minimum viable product requirement.

#### New Goals
    - Test the implementation of the model against human-generated and AI- generated texts.
    - Help to integrate the model with the controller and front-end component for next week's beta release.

### Simon Struthers

#### Previous Goals
1. Create adequate styling for UI elements
2. Create manual document submission form
3. Prototype in-progress and completed submission list

#### Progress
- PDF previews in document submission form
- Started with submission list, but changes are not yet committed

#### New Goals
1. Finish document submission form
2. Finish submission listings

### Muhammad Ammar

#### Previous Goals

Familiarize myself with openAI and huggingface APIs and use them to request essays.

### Progress
I was able to generate essays through openAI API and learnt to use inference API from hugginface if we need to use a model from there.

### New Goals
Think of ways to compare AI generated and human written essays. We will need some factors and reward system to compare two essays and find similarities in them.