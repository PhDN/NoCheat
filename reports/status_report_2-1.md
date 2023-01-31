# Status Report 2/1
## Team Report
#### Previous Goals

## Individual Reports

### Alex Hugli
-Added to the living document use case #5 - the uploading of a web URL instead of a text document
-Added to the living document a pros and cons list of using an SVM (support vector machine) vs. a neural network
    for the job of classifying whether a document is machine-generated.
-Got role of acquiring/generating data, as well as front and back end linking

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
