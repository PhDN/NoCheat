import os, argparse
from flask import Flask, json, request, Response, send_from_directory
from werkzeug.datastructures import FileStorage, MultiDict
from typing import Mapping, Any

def set_up_server(app: Flask):
    jobs = {}

    HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']

    def api_response(response: Mapping[str, Any], status: int = 200):
        response['status'] = status
        return app.response_class(response = json.dumps(response), status = status, mimetype = 'application/json')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        print(path, path == '')
        if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        elif path == '':
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return "Page not found", 404

    @app.route('/api/submit', methods = HTTP_METHODS)
    def api_submit():
        if request.method != 'POST':
            return api_response({
                'message': f"Disallowed request method {request.method}"
            }, 405)
        if not request.headers.get('Content-Type').startswith('multipart/form-data'):
            return api_response({
                'message': f'Invalid content-type {request.headers.get("Content-Type")}'
            }, 400)

        # TODO: process files
        files : MultiDict[str, FileStorage] = request.files

        return api_response({})

    @app.route('/api', methods = HTTP_METHODS)
    def api_test():
        return api_response({ 'message': "Page not found" }, 404)

    return app

def main():
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
    app = Flask(__name__, static_folder = args.static_dir)
    set_up_server(app).run(port = args.port, threaded = True, use_reloader = True)

if __name__ == '__main__':
    main()
