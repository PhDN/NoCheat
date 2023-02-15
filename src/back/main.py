import os, argparse, asyncio, traceback
from concurrent import futures
from concurrent.futures import CancelledError, Future, ThreadPoolExecutor, TimeoutError
from random import randbytes
from typing import Any, Mapping, List, Optional, Tuple, Union

from flask import Flask, json, request, Response, send_from_directory
from werkzeug.exceptions import HTTPException, BadRequest, Conflict, MethodNotAllowed, NotFound, UnsupportedMediaType
from werkzeug.datastructures import BytesIO, FileStorage

from Controller import parse_file, Controller

def set_up_server(app: Union[Flask, str], static_dir: Optional[str] = None):
    if isinstance(app, str):
        app = Flask(app, static_folder = static_dir)

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

    executor = ThreadPoolExecutor(max_workers = 20)
    jobs: Mapping[str, Future] = {}
    def generate_job_id() -> str:
        return ''.join(map(lambda x: hex(x)[2:].zfill(2), randbytes(16)))

    def exec_job(job_id: str, files: List[Tuple[str, Union[str, IOError]]]):
        controller = Controller.get_instance()
        results = []
        error = False

        for filename, text in files:
            try:
                if isinstance(text, IOError):
                    results.append({ 'name': filename, 'status': str(text) })
                else:
                    results.append({ 'name': filename, 'status': controller.process_text(text)[1] })
            except Exception as e:
                e.__traceback__
                error = True
                print(f'Error for file {filename} in job {job_id}:', traceback.format_exc())
                results.append({ 'name': filename, 'status': f'500 {e}' })

        return { 'status': 'error' if error else 'complete', 'documents': results }

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
            raise UnsupportedMediaType(f'Unsuported content type {request.headers.get("Content-Type")}')
        else:
            job_files = []
            for filelist in request.files:
                for file in request.files.getlist(filelist):
                    try:
                        job_files.append((file.filename, parse_file(file)))
                    except IOError as e:
                        job_files.append((file.filename, e))

            job_id: str = generate_job_id()
            while job_id in jobs:
                job_id = generate_job_id()

            job = executor.submit(exec_job, job_id, job_files)
            jobs[job_id] = job

            return api_response({ 'job': job_id })
    
    @app.route('/api/job/<job>', methods = ['GET'])
    def api_job(job: str):
        """Await job completion."""

        if job not in jobs:
            raise NotFound(f'Job {job} has been cancelled or does not exist')

        done = futures.wait([ jobs[job] ], timeout = request.args.get('timeout', type = float))
        if len(done.not_done) > 0:
            return api_response({ 'message': "Timeout expired" }, 408)
        elif jobs[job].cancelled():
            return api_response({ 'message': f"Job {job} has been cancelled" }, 410)
        else:
            result = jobs[job].result()
            del jobs[job]
            return api_response({ 'data': result })

    @app.route('/api/job/<job>', methods = ['DELETE'])
    def api_cancel_job(job: str):
        """Cancels a given job."""

        if job not in jobs:
            raise NotFound(f'Job {job} does not exist')
        elif jobs[job].done():
            raise Conflict(f'Job {job} already completed')
        else:
            jobs[job].cancel()
            del jobs[job]
            return api_response({})

    @app.route('/api/job/<job>/query', methods = ['GET'])
    def api_query_job(job: str):
        """Query job status."""

        if job not in jobs:
            return api_response({ 'data': { 'status': 'cancelled' } }, 404)
        elif jobs[job].cancelled():
            return api_response({ 'data': { 'status': 'cancelled' } })
        else:
            return api_response({ 'data': { 'status': 'complete' if jobs[job].done() else 'waiting' } })

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

    @app.errorhandler(409)
    def error_409(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "409 CONFLICT", 409

    @app.errorhandler(415)
    def error_415(error):
        if request.path == '/api' or request.path.startswith('/api/'):
            return api_response(error)
        else:
            return "415 UNSUPPORTED MEDIA TYPE", 415

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
    parser.add_argument('--debug',
        action = 'store_true',
        dest = 'debug',
        help = 'Run in debug mode')
    args = parser.parse_args()

    set_up_server(__name__, args.static_dir).run(debug = args.debug, port = args.port, threaded = True, use_reloader = True)
