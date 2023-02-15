# NoCheat
NoCheat is a web application and machine learning algorithm that allows for the detection of AI-generated text content. 

Weekly progress reports are contained in the reports directory.

## Running the File

First, install [Anaconda](https://www.anaconda.com/download) and set up the Python environment using the command `conda env create --file=env.yml`.

Next, install [Node & NPM](https://docs.npmjs.com/cli/v9/configuring-npm/install) and run the command `npm --prefix src/front ci` to install the frontend's dependencies. Then, you can run `npm --prefix src/front run build` to build the React app.

Finally, run the Flask server to host the website and API with the command `python src/back/main.py`. The `--help` option should list configurable settings, such as `-p` to run the server on a  port of your choosing for ease of development.
