# Status Report 1/18
## Team Report
#### Previous Goals
We all need to set up our programming environments, and gain familiarity with any APIs that we have not used before. We also need to populate our repo with the basic instructions and info corresponding to our setup and finish the Git assignment.
#### Progress
A .yml file to allow the programming environment to be set up via Conda has been created. We have filled in the necessary parts of the repo for the Git assignment, and have adjusted plans to account for prototyping to familiarize ourselves with new APIs.
#### New Goals
We must add three new sections to the Living Doc as part of next weeks assignment. To do that we need to finalize our plans with the software architecture and establish coding guidelines. Additionally, we would like to have a basic data set for cursory tests collected. 

## Individual Reports
### Dylan Frohberg
#### Previous Goals
I need to install the appropriate APIs and set up my Python environment within PyCharm. I also need to sync up with the Github repo. Finally, I want to read/review the API docs and experiment with them, particularly Hugging Face, since I have not used it before.
#### Progress
I created the .yml file and have read some of the doc for the Hugging Face API, which was the one I was completely unfamiliar with. I also helped to make a number of the changes to our Living Doc and adjust our plans. I think I did a better job at taking the initiative this week, but at the same time I am still not clear about my exact duties at the time of writing this.
#### New Goals
I would like to set up the basic skeleton for my part of the project and need to complete my portion of next week's assignment.

### Simon Struthers
#### Previous Goals
1. Figure out where and how to host our website in the cloud.
2. Create a skeleton for the back-end code.

#### Progress
Barebones skeleton for the back-end has been written, along with instructions. Still need to determine where in the cloud to host the website, but GitHub appears to provide several templates to pick from.

#### New Goals
1. Figure out where and how to host our website in the cloud.
2. Get started on React front-end & code.
3. Make launching a local test server more convenient.

### Phuong Duy Nguyen

#### Previous Goals
    - Read up on the literature review paper on Detection of AI generated text to understand how to approach this problem
    - Explore how to use the ChatGPT API in order automate text generation and pull results from ChatGPT

#### Progress
    - Finished reading the literature review paper on Detection of AI generated text
    - Identified that we should use a simpler metric like text perplexity to simplify our ML model and have a working prototype first, but other metrics such as frequency based on Zip's laws, or inverse data frequency (TF-IDF), could also be used instead.
    - An official ChatGPT API is not yet avaiable, but have found several existing solutions to interact with ChatGPT
        - https://github.com/acheong08/ChatGPT
        - https://github.com/waylaidwanderer/node-chatgpt-api

#### New Goals
    - Explore which ML based approaches can work for this problem, maybe there are non neural network approaches like SVM or k-means that could work.
    

### Muhammad Ammar
#### Previous Goals
Install pycharm and anaconda and get familiar with APIs we will be using.
#### Progress
I installed all the required tools for the project and getting familiar with using openAI. I am trying to generate some essay that we can use to either compare the students essays with directly or use in a dataset depending on what path we take.
#### New Goals
Use openAI to create essays on a particular topic and store them in a text file.

### Alex Hugli
-Added to the living document use case #5 - the uploading of a web URL instead of a text document
-Added to the living document a pros and cons list of using an SVM (support vector machine) vs. a neural network
    for the job of classifying whether a document is machine-generated.
-Got role of acquiring/generating data, as well as front and back end linking

#### Previous Goals
Get a concrete role and start describing features
#### Progress
-Living document updated with more use cases to better specify design. 
-Got a more concrete role (data acquisition)
#### New Goals
-Find a file set of essays, or an easily-formatted database/repository of essays (perhaps dissertations?)
-Utilize the GPT-3 API and design a routine that generates cheap, fairly complex machine-generated essays