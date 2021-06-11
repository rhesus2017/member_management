from flask import jsonify, request, Blueprint, session
from flask.globals import session, current_app
from datetime import timedelta
import pymysql
import random
import logging
import bcrypt 

logger = logging.getLogger(__name__)
blueprint = Blueprint('auth', __name__)

@blueprint.route("/api/login", methods=['POST'])
def login():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=10)

    phone = request.get_json()['phone']['Phone']
    password = request.get_json()['password']['Password']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select * from auth')
        rows = cursor.fetchall()

        coincide = False

        for row in rows:
            if row['phone'] == phone and bcrypt.checkpw(password.encode('utf-8'), row['password'].encode('utf-8')) == True:
                coincide = True   
            
                userId = row['id']
                userName = row['name']

                session['userId'] = userId
                session['userName'] = userName

                response = {'result': '000000', 'userId': userId, 'userName': userName}
                break
            else:
                coincide = False
                pass
        
        if coincide == False:
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

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    phone = request.get_json()['phone']['Phone']
    name = request.get_json()['name']['Name']
    certification = request.get_json()['certification']['Certification']
    password = request.get_json()['password']['Password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select phone from auth')
        rows = cursor.fetchall()

        for row in rows:
            if row['phone'] == phone:
                response = {'result': '000010'}
                break

        if certification != session['certification_number']:
            response = {'result': '000020'}
        else:
            cursor.execute('insert into auth (phone, name, password) values(%s, %s, %s)', [phone, name, password])
            db.commit()
            session.clear()
            response = {'result': '000000'}

    response = jsonify(response)
    return response


@blueprint.route("/api/join/certification", methods=['POST'])
def certification():

    number_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    number = random.sample(number_array, 6)
    certification_number = str(number[0]) + str(number[1]) + str(number[2]) + str(number[3]) + str(number[4]) + str(number[5])
    session['certification_number'] = certification_number
    logger.info(f'인증번호 [{certification_number}] 발급 완료')

    response = {'result': '000000', 'number' : certification_number}
    response = jsonify(response)
    return response


@blueprint.route("/api/get_information", methods=['POST'])
def get_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    userId = request.get_json()['userId']['UserId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select * from auth')
        rows = cursor.fetchall()

        coincide = False                                                           

        for row in rows:
            if row['id'] == userId:
                coincide = True   

                userPhone = row['phone']
                userName = row['name']

                response = {'result': '000000', 'userPhone': userPhone, 'userName': userName}
                break
            else:
                pass
        
        if coincide == False:
            response = {'result': '000010'}
        
    response = jsonify(response)
    return response


@blueprint.route("/api/change_information", methods=['POST'])
def change_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    name = request.get_json()['name']['Name']
    password = request.get_json()['password']['Password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')
    userId = request.get_json()['userId']['UserId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('UPDATE auth SET name = %s, password = %s where id = %s', [name, password, userId])
        db.commit()

    session['userName'] = name

    response = {'result': '000000', 'userName': name}
    response = jsonify(response)
    return response


@blueprint.route("/api/session_check", methods=['GET'])
def session_check():

    if 'userId' in session:
        response = {'result': '000000', 'session': True}
    else:
        response = {'result': '000000', 'session': False}

    response = jsonify(response)
    return response
