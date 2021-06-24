from flask import jsonify, request, Blueprint, session
from flask.globals import session, current_app
from datetime import timedelta
from functools import wraps
import pymysql
import random
import logging
import bcrypt 


logger = logging.getLogger(__name__)
blueprint = Blueprint('auth', __name__)


def stop_account(f):
  @wraps(f)
  def decoratored_function(*args, **kwargs):
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select state from auth where id = %s', [session['userId']])
        row = cursor.fetchone()
        
        if row['state'] == 'O':
            session.clear()
            response = {'result': '000080'}  
            response = jsonify(response)
            return response

        elif row['state'] == 'S':
            session.clear()
            response = {'result': '000090'}  
            response = jsonify(response)
            return response

    return f(*args, **kwargs) 
  return decoratored_function



@blueprint.route('/api/login', methods=['POST'])
def login():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=60)

    phone = request.get_json()['phone']['Phone']
    password = request.get_json()['password']['Password']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select * from auth')
        rows = cursor.fetchall()

        for row in rows:
            if row['phone'] == phone and bcrypt.checkpw(password.encode('utf-8'), row['password'].encode('utf-8')) == True:

                if row['state'] == 'O':
                    response = {'result': '000080'}
                    response = jsonify(response)
                    return response
                elif row['state'] == 'S':
                    response = {'result': '000090'}
                    response = jsonify(response)
                    return response
                else:
                    userId = row['id']
                    userName = row['name']
                    userGrade = row['grade']

                    session['userId'] = userId
                    session['userName'] = userName
                    session['userGrade'] = userGrade

                    response = {'result': '000000', 'userId': userId, 'userName': userName, 'userGrade': userGrade}
                    response = jsonify(response)
                    return response

    response = {'result': '000010'}  
    response = jsonify(response)
    return response


@blueprint.route('/api/logout', methods=['POST'])
def logout():

    session.clear()

    response = {'result': '000000'}
    response = jsonify(response)
    return response


@blueprint.route('/api/join', methods=['POST'])
def join():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    phone = request.get_json()['phone']['Phone']
    name = request.get_json()['name']['Name']
    certification = request.get_json()['certification']['Certification']
    password = request.get_json()['password']['Password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select phone, state from auth')
        rows = cursor.fetchall()

        for row in rows:
            if row['phone'] == phone:
                if row['state'] == 'S':
                    if certification != session['certification_number'] or phone != session['phone_number']:
                        response = {'result': '000020'}
                        response = jsonify(response)
                        return response
                    else:
                        cursor.execute('UPDATE auth SET name = %s, password = %s, grade = %s, state = %s where phone = %s', [name, password, 'guest', 'J', phone])
                        db.commit()
                        session.clear()
                        response = {'result': '000000'}
                        response = jsonify(response)
                        return response
                else:
                    response = {'result': '000010'}
                    response = jsonify(response)
                    return response

        if certification != session['certification_number'] or phone != session['phone_number']:
            response = {'result': '000020'}
            response = jsonify(response)
            return response
        else:
            cursor.execute('insert into auth (phone, name, password) values(%s, %s, %s)', [phone, name, password])
            db.commit()
            session.clear()
            response = {'result': '000000'}
            response = jsonify(response)
            return response


@blueprint.route('/api/join/certification', methods=['POST'])
def certification():

    number_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    number = random.sample(number_array, 6)
    certification_number = str(number[0]) + str(number[1]) + str(number[2]) + str(number[3]) + str(number[4]) + str(number[5])
    phone_number = request.get_json()['phone']['Phone']

    session['certification_number'] = certification_number
    session['phone_number'] = phone_number

    logger.info(f'인증번호 [{certification_number}] 발급 완료')

    response = {'result': '000000', 'number' : certification_number}
    response = jsonify(response)
    return response


@blueprint.route('/api/get_information', methods=['POST'])
@stop_account
def get_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    userId = request.get_json()['userId']['UserId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select * from auth where id=%s', [userId])
        row = cursor.fetchone()

        userPhone = row['phone']
        userName = row['name']

        response = {'result': '000000', 'userPhone': userPhone, 'userName': userName}
        response = jsonify(response)
        return response


@blueprint.route('/api/change_information', methods=['POST'])
@stop_account
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


@blueprint.route('/api/get_all_information', methods=['POST'])
@stop_account
def get_all_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    userId = request.get_json()['userId']['UserId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select grade from auth where id=%s', [userId])
        thisUser = cursor.fetchone()

        cursor.execute('select * from auth')
        rows = cursor.fetchall()                                               

    if thisUser['grade'] == 'master' or thisUser['grade'] == 'admin':
        response = {'result': '000000', 'rows': rows}
    else:
        response = {'result': '000010'}

    response = jsonify(response)
    return response


@blueprint.route('/api/change_member_information', methods=['POST'])
@stop_account
def change_member_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    name = request.get_json()['name']['Name']
    password = request.get_json()['password']['Password']
    password_bcrypt = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')
    grade = request.get_json()['grade']['Grade']
    state = request.get_json()['state']['State']
    memberId = request.get_json()['memberId']['MemberId']
    userId = request.get_json()['userId']['UserId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('select grade from auth where id=%s', [userId])
        thisUser = cursor.fetchone()

        cursor.execute('select grade from auth where id=%s', [memberId])
        row = cursor.fetchone()

        if row['grade'] == 'master' and session['userGrade'] != 'master':
            response = {'result': '000020'}
            response = jsonify(response)
            return response
        elif thisUser['grade'] != 'master' and thisUser['grade'] != 'admin':
            response = {'result': '000010'}
            response = jsonify(response)
            return response

        if password != '':
            cursor.execute('UPDATE auth SET name = %s, password = %s, grade = %s, state = %s where id = %s', [name, password_bcrypt, grade, state, memberId])
        else:
            cursor.execute('UPDATE auth SET name = %s, grade = %s, state = %s where id = %s', [name, grade, state, memberId])
        db.commit()

    session['grade'] = grade

    response = {'result': '000000'}
    response = jsonify(response)
    return response


@blueprint.route('/api/out_member', methods=['POST'])
@stop_account
def out_member():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)
    
    password = request.get_json()['password']['Password']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('select password from auth where id = %s', [session['userId']])
        userId = cursor.fetchone()

        if bcrypt.checkpw(password.encode('utf-8'), userId['password'].encode('utf-8')) == True:
            cursor.execute('UPDATE auth SET state = %s where id = %s', ['O', session['userId']])
            db.commit()
            session.clear()
            response = {'result': '000000'}  
            response = jsonify(response)
            return response
        
    response = {'result': '000010'}  
    response = jsonify(response)
    return response


@blueprint.route('/api/session_check', methods=['POST'])
def session_check():

    if 'userId' in session:
        response = {'result': '000000', 'session': True}
    else:
        response = {'result': '000000', 'session': False}

    response = jsonify(response)
    return response
