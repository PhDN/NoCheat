# Developer Documentation

## How to obtain the source code
All source code used to implement, lay out, and develop NoCheat is available at this GitHub repository https://github.com/PhDN/NoCheat.

## Directory structure
- `/` - Root directory
  - `.github/workflows/` - GitHub Actions
  - `src/` - Source code and test files
    - `back/` - Server code
      - `Controller.py` - File decoder
      - `main.py` - The server software
      - `model.py` - Language proceessing model
    - `front/` - Website code
      - `public/` - Static files
      - `src/` - React.js code
        - `*.js` - Component source code
        - `*.test.js` - Test file for a given component
      - `package.json` - Node package file for frontend dependencies
    - `test/` - Test files
      - `data/` - Files used in unit tests
      - `test_controller.py` - PyTest file for `Controller.py`
  - `bugReportTemplate.md` - Template for reporting bugs
  - `devdocs.md` - *you are here*
  - `userDocs.md` - User documentation
  - `environment.yml` - Conda environment file for backend dependencies
  - `README.md` - Project synopsis

## How to build the software
**NOTICE:** If you want to build or run the sever on Windows, you must do so using the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install). Follow the link for instructions as to how to set up a WSL instance, use a terminal into your WSL insance, and then follow the instructions below.

### 1. Install language tools
The developer dependencies needed to build and start a NoCheat web server are [Python 3.10](https://www.python.org/downloads/), [Anaconda](https://www.anaconda.com/download), and [Node.js](https://nodejs.org/en/download/). Install these onto your system if they are not available.

[Here](https://gist.github.com/kauffmanes/5e74916617f9993bc3479f401dfec7da) is a helpful guide to installing Anaconda on WSL. [Here](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) is a helpful guide to installing Node.js on WSL.

### 2. Set up environment and install dependencies
If you are setting up NoCheat for the first time, download this repository and open a terminal in its root directory on your system. Enter the command `conda env create --file=environment.yml`. It may take a few minutes to set up and resolve the environment on a new system.

If you already have a NoCheat environment set up, and are pulling a newer or separate branch from the NoCheat repository, use the `conda env update` command to update the backend dependencies.

Run the command `conda activate nocheat` to activate the newly set-up Python environment.

Finally, run the command `npm --prefix src/front install` to install the dependencies for building the web page viewed in the frontend.

### 3. Building the frontend
Run the command `npm --prefix src/front run build` to build the website.

### 4. Running the server
Run the command `python src/back/main.py` to start the NoCheat server. Then visit `localhost:8080` via a browser to view the website. The default port it serves its content from is currently 8080 for development purposes. To test a different port, append `-p <port-number>` to the command (e.g. `-p 80` to run from port `localhost:80`).

## How to test the software
For running tests, complete at least steps 1 and 2 for building the software.

### Backend tests
Run `pytest src/test` from the root directory to perform backend tests.

### Frontend tests
If you have not previously run the frontend tests, run the command `npm --prefix src/front install --dev` to install the necessary frontend development dependencies.

Afterward or otherwise, run `npm --prefix src/front run test` to perform frontend tests.

## How to add new tests
Add files for testing `NoCheat` to the `src/test/data/` directory.

## How to build a release of the software
Presently, no additional steps are needed to create a release build of NoCheat. This is open to change in the future, as Flask, which NoCheat uses to run its backend, recommends [using an alternative WSGI server when deploying to production](https://flask.palletsprojects.com/en/2.2.x/tutorial/deploy/).
