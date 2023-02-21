# Status Report 2/6
## Team Report
#### Previous Goals
We want to have a working beta by 2/14, and should have revised the Living Doc for submission with it. We also need to make the slides for the presentation.
#### Progress
We completed the project on time, and got the presentation recorded. The Living Doc was also fixed up.
#### New Goals
We need to start implementing the remaining features that were not working in the beta. We also need the solidify the documentation.

## Individual Reports

### Dylan Frohberg
#### Previous Goals
I need to add the controller and test to the README as well as finish implementing the FeatureExtractor component. I also plan to help on the assignment for the next week.
#### Progress
I fixed the Living Doc so it no longer used future tense except for the cases where it was actually talking about future events. I also removed as much ambiguous language as I could find. I finished setting up the Controller so that it parses TXT and PDF documents.
#### New Goals
I want to build on what is already there, specifically, I want to get DOCX and DOC parsing working, as well as add to the result analysis fed back to the website. I also want to see if I can improve the file processing so that there are more features to process.

### Alex Hugli
-Got role of acquiring/generating data, as well as front and back end linking
-Found data set (1.7mn)
-Got API access and figured out formats to be used in training (txt, pdf)

#### Previous Goals
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
#### Progress

#### New Goals


### Phuong Duy Nguyen

#### Previous Goals
    - Test the implementation of the model against human-generated and AI- generated texts.
    - Help to integrate the model with the controller and front-end component for next week's beta release.

#### Progress
    - Verified that the model works on a small dataset of text documents, included in in src/test.
    - Succesfully integreated the model with the controller, which was intergrated with the front-end API by Simon and Dylan.
    - Worked on the presentation and video recording for beta release report.

#### New Goals
    - Work together to integrate the display output metrics of the model on input text document through the controller and front-end UI.
    - Explore new model aproach using open-sourced implementation of GLTR, or DetectGPT
    - Integrate open-sourced implementation of chosen model via Hugging Face API or self-implement.


### Simon Struthers

#### Previous Goals
1. Finish document submission form
2. Finish submission listings

#### Progress
I've managed to complete the minimum viable product for both the document submission form and the job submission listings, as well as fix some backend bugs relating to queuing jobs and errors in the model's calculations.

#### New Goals
1. Start writing tests for the frontend.
2. Frontend quality-of-life improvements; e.g. word wrap toggle, text file preview

### Muhammad Ammar

#### Previous Goals

Think of ways to compare AI generated and human written essays. We will need some factors and reward system to compare two essays and find similarities in them.

### Progress

Set up files to generate AI essays. Created a parsing algorithm to parse through human and AI essay and compare similarities. Worked for essays that had some matching sentences. Due to merge conflicts, the code was not pushed and with the new model, we might not need it.

### New Goals

Fix my git issues so my commits show under my name. Follow the documentation to get a working demo on my end. 