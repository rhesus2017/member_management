from flask import jsonify, request, Blueprint
from flask.globals import session, current_app
from datetime import timedelta

blueprint = Blueprint('auth', __name__)


@blueprint.route("/api/login", methods=['POST'])
def login():

    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=5)

    if request.get_json()['phone']['Phone'] == '01039345623' and request.get_json()['password']['Password'] == '1234':

        userId = 3
        userName = '김태진'

        session['userId'] = userId
        session['userName'] = userName
        
        response = {'result': '000000', 'userId': userId, 'userName': userName}
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


@blueprint.route("/api/get_information", methods=['POST'])
def get_information():

    if request.get_json()['userId']['UserId']:

        userPhone = '01039345623'
        userName = '김태진'
        
        response = {'result': '000000', 'userPhone': userPhone, 'userName': userName}
        
    response = jsonify(response)
    return response


@blueprint.route("/api/change_information", methods=['POST'])
def change_information():

    session['userName'] = request.get_json()['name']['Name']

    response = {'result': '000000', 'userName': request.get_json()['name']['Name']}

    response = jsonify(response)
    return response


@blueprint.route("/api/session_check", methods=['GET'])
def session_check():

    if 'userId' in session:
        response = {'result': '000000', 'session': True}
    else:
        print('!')
        response = {'result': '000000', 'session': False}

    response = jsonify(response)
    return response
