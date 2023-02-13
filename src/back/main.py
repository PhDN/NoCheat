import os, argparse
from random import randbytes
from typing import Any, Mapping, Optional, Union

from flask import Flask, json, request, Response, send_from_directory
from werkzeug.exceptions import HTTPException, BadRequest, MethodNotAllowed, NotFound
from werkzeug.datastructures import FileStorage

def set_up_server(app: Union[Flask, str], static_dir: Optional[str] = None):
    if isinstance(app, str):
        app = Flask(app, static_folder = static_dir)

    jobs = {}

    def generate_job_id() -> str:
        return ''.join(map(lambda x: hex(x)[2:].zfill(2), randbytes(16)))

    def api_response(response: Union[Mapping[str, Any], HTTPException], status: Optional[int] = None):
        if isinstance(response, HTTPException):
            status = response.code
        elif status is None:
            status = 200

        if isinstance(response, MethodNotAllowed):
            response = { 'allowed': list(response.valid_methods), 'message': f"Disallowed request method {request.method}" }
        elif isinstance(response, HTTPException):
            response = { 'message': response.description }

        response['status'] = status
        return app.response_class(response = json.dumps(response), status = status, mimetype = 'application/json')

    @app.route('/', defaults = {'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """Serves a file from the static directory."""

        if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        elif path == '':
            return send_from_directory(app.static_folder, 'index.html')
        else:
            raise NotFound()

    @app.route('/api/submit', methods = ['POST'])
    def api_submit():
        """Submits a new document analysis job to the server."""

        if not request.headers.get('Content-Type').startswith('multipart/form-data'):
            raise BadRequest(f'Unsuported content type {request.headers.get("Content-Type")}')
        else:
            job_files = []
            for filelist in request.files:
                for file in request.files.getlist(filelist):
                    job_files.append(file)

            job_id: str = generate_job_id()
            while job_id in jobs:
                job_id = generate_job_id()

            # TODO: place in jobs queue & launch
            jobs[job_id] = job_files

            return api_response({ 'job': job_id })
    
    @app.route('/api/job/<job>', methods = ['GET'])
    def api_job(job: str):
        if job not in jobs:
            raise NotFound(f'Job {job} does not exist')
        else:
            # TODO: wait until job is completed
            return api_response({})

    @app.errorhandler(400)
    def error_400(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "400 BAD REQUEST", 400

    @app.errorhandler(404)
    def error_404(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "404 NOT FOUND", 404

    @app.errorhandler(405)
    def error_405(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "405 METHOD NOT ALLOWED", 405

    @app.errorhandler(500)
    def error_500(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "500 INTERNAL SERVER ERROR", 500

    return app

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        prog = 'NoCheat',
        description = 'Runs the NoCheat server')
    parser.add_argument('-f', '--static-directory',
        action = 'store',
        default = os.path.join(os.path.dirname(__file__), '..', 'front', 'build'),
        dest = 'static_dir',
        help = 'Sets the static directory from which to serve frontend content')
    parser.add_argument('-p', '--port',
        action = 'store',
        default = 80,
        dest = 'port',
        help = 'Sets the port on which this server listens to',
        type = int)
    args = parser.parse_args()

    set_up_server(__name__, args.static_dir).run(port = args.port, threaded = True, use_reloader = True)
