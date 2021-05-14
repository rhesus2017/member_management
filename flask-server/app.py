from flask import Flask, render_template, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('index.html')


@app.route("/api/login", methods=['POST'])
def login():

    if request.get_json()['id']['Id'] == 'master' and request.get_json()['password']['Password'] == '1234':
        result = {'result': True}
    else:
        result = {'result': False}
        
    result_json = jsonify(result)
    return result_json


@app.route("/api/join", methods=['POST'])
def join():
    result = {'result': True}    
    result_json = jsonify(result)
    return result_json


@app.route("/api/join/certification", methods=['POST'])
def certification():
    result = {'result': True, 'number' : 000000}    
    result_json = jsonify(result)
    return result_json


if __name__ == '__main__':
    app.run()
    # app.run(host='0.0.0.0')
