from flask import jsonify, request, Blueprint
from flask.globals import session

blueprint = Blueprint('auth', __name__)


@blueprint.route("/api/login", methods=['POST'])
def login():

    if request.get_json()['phone']['Phone'] == '01039345623' and request.get_json()['password']['Password'] == '1234':

        userId = 3
        name = '김태진'

        session['userId'] = userId
        session['name'] = name
        
        response = {'result': '000000', 'userId': userId, 'name': name}
    else:
        response = {'result': '000010'}
        
    response = jsonify(response)
    return response


@blueprint.route("/api/logout", methods=['POST'])
def logout():
    session.clear()

    response = {'result': '000000'}
    response = jsonify(response)
    return response


@blueprint.route("/api/join", methods=['POST'])
def join():
    if request.get_json()['phone']['Phone'] == '01039345623':
        response = {'result': '000010'}
    elif request.get_json()['certification']['Certification'] != '123456':
        response = {'result': '000020'}
    else:
        response = {'result': '000000'}

    response = jsonify(response)
    return response


@blueprint.route("/api/join/certification", methods=['POST'])
def certification():

    if request.get_json()['phone']['Phone'] == '01012345678':
        response = {'result': '000010'}
    else:
        response = {'result': '000000', 'number' : 123456}

    response = jsonify(response)
    return response