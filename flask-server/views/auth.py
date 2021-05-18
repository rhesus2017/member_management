from flask import jsonify, request, Blueprint

blueprint = Blueprint('auth', __name__)


@blueprint.route("/api/login", methods=['POST'])
def login():

    if request.get_json()['phone']['Phone'] == '01039345623' and request.get_json()['password']['Password'] == '1234':
        result = {'result': True}
    else:
        result = {'result': False}
        
    result_json = jsonify(result)
    return result_json


@blueprint.route("/api/join", methods=['POST'])
def join():
    if request.get_json()['certification']['Certification'] == '123456':
        result = {'result': True}
    else:
        result = {'result': False}

    result_json = jsonify(result)
    return result_json


@blueprint.route("/api/join/certification", methods=['POST'])
def certification():
    result = {'result': True, 'number' : 123456}    
    result_json = jsonify(result)
    return result_json