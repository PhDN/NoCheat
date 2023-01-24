import os, argparse
from flask import Flask, Response, send_from_directory

def set_up_server(app: Flask):
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

    @app.route('/api', methods=['GET'])
    def api_test():
        return Response('{ "status": 200 }', 200, mimetype = 'application/json')

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
