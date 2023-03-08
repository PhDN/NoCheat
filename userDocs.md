# User Documentation

## Description
NoCheat is a web application that tests essays written by humans and AI. It serves as an anti cheat software that can detect the authenticity of a human written essay. Our machine learning model is able to differentiate between a human written essay and an AI generated essay. 
It is very easy to generate essays on any given topic with the help of chatGPT. Our users such as teachers would want to use NoCheat to detect plagiarism in student's essays. 

## How to install the software
Currently, there is no need to install the software to be run.
It will be posted here if we cover more use cases and bring NoCheat to other platforms.

## How to run the software
At the moment the site is not hosted. However, users can run it themselves by following the instructions from the [README](README.md#Self-Hosting_Instructions).

## How to use the software
Once the web application opens, user can upload one or multiple text files. This can be done via clicking on the submission bar and uploading files from the computer, or by clicking the grey plus button and inserting the text manually. Clicking the blue submit button will create a new job, which will finish when the files are processed.
Our model will parse through the files and return a message declaring if the text is human or AI generated.
In some cases, model might require more information in order to make a decision. It requires at least 100 characters at a minimum.

More detailed instructions can be found [here](instructions.md).

Answers to commonly asked questions can be found [here](faq.md).

## How to report a bug
To report a bug, use github Issues with the following template:
- [Bug report template](bugReportTemplate.md)

## Known bugs