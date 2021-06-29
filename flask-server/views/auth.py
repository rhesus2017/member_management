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


def check_account_state_decoration(f):
  @wraps(f)
  def decoratored_function(*args, **kwargs):
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    userId = request.get_json()['userId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select state, login_check from auth where id = %s', [userId])
        row = cursor.fetchone()

        if 'userId' in session:
            if row['state'] == 'O':
                cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', session['userId']])
                db.commit()
                session.clear()
                response = {'result': '000303'}  
                response = jsonify(response)
                return response
            elif row['state'] == 'S':
                cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', session['userId']])
                db.commit()
                session.clear()
                response = {'result': '000302'}  
                response = jsonify(response)
                return response
            elif row['login_check'] == 'D':
                session.clear()
                response = {'result': '000301'}  
                response = jsonify(response)
                return response
        else:
            if userId != 0:
                cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', userId])
                db.commit()
                response = {'result': '000300'}  
                response = jsonify(response)
                return response
            elif userId == 0:
                response = {'result': '000304'}  
                response = jsonify(response)
                return response
    
    return f(*args, **kwargs)
  return decoratored_function


@blueprint.route('/api/login', methods=['POST'])
def login():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=1)

    phone = request.get_json()['phone']
    password = request.get_json()['password']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select * from auth')
        rows = cursor.fetchall()

        for row in rows:
            if row['phone'] == phone and bcrypt.checkpw(password.encode('utf-8'), row['password'].encode('utf-8')) == True:

                if row['state'] == 'O':
                    response = {'result': '000303'}
                    response = jsonify(response)
                    return response
                elif row['state'] == 'S':
                    response = {'result': '000302'}
                    response = jsonify(response)
                    return response
                else:
                    userId = row['id']
                    userName = row['name']
                    userGrade = row['grade']

                    session['userId'] = userId
                    session['userName'] = userName
                    session['userGrade'] = userGrade

                    cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['C', session['userId']])
                    db.commit()

                    response = {'result': '000000', 'userId': userId, 'userName': userName, 'userGrade': userGrade}
                    response = jsonify(response)
                    return response

        response = {'result': '000010'}  
        response = jsonify(response)
        return response


@blueprint.route('/api/logout', methods=['POST'])
@check_account_state_decoration
def logout():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', session['userId']])
        db.commit()
        session.clear()
        response = {'result': '000000'}
        response = jsonify(response)
        return response


@blueprint.route('/api/join', methods=['POST'])
def join():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    phone = request.get_json()['phone']
    name = request.get_json()['name']
    certification = request.get_json()['certification']
    password = request.get_json()['password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select phone, state from auth')
        rows = cursor.fetchall()

        for row in rows:
            if row['phone'] == phone:
                if row['state'] == 'O':
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
                    session.clear()
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


@blueprint.route('/api/join/get_certification', methods=['POST'])
def get_certification():
    number_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    number = random.sample(number_array, 6)
    certification_number = str(number[0]) + str(number[1]) + str(number[2]) + str(number[3]) + str(number[4]) + str(number[5])
    phone_number = request.get_json()['phone']

    session['certification_number'] = certification_number
    session['phone_number'] = phone_number

    logger.info(f'인증번호 [{certification_number}] 발급 완료')


@blueprint.route('/api/get_user_information', methods=['POST'])
@check_account_state_decoration
def get_user_information():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select phone, name from auth where id=%s', [session['userId']])
        row = cursor.fetchone()

        response = {'result': '000000', 'userPhone': row['phone'], 'userName': row['name']}
        response = jsonify(response)
        return response


@blueprint.route('/api/change_user_information', methods=['POST'])
@check_account_state_decoration
def change_user_information():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    name = request.get_json()['name']
    password = request.get_json()['password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('UPDATE auth SET name = %s, password = %s where id = %s', [name, password, session['userId']])
        db.commit()
        session['userName'] = name
        response = {'result': '000000'}
        response = jsonify(response)
        return response


@blueprint.route('/api/out_user', methods=['POST'])
@check_account_state_decoration
def out_user():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)
    
    password = request.get_json()['password']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select password from auth where id = %s', [session['userId']])
        row = cursor.fetchone()

        if bcrypt.checkpw(password.encode('utf-8'), row['password'].encode('utf-8')) == True:
            cursor.execute('UPDATE auth SET state = %s, login_check = %s where id = %s', ['O', 'D', session['userId']])
            db.commit()
            session.clear()
            response = {'result': '000000'}  
            response = jsonify(response)
            return response
        else:
            response = {'result': '000010'}  
            response = jsonify(response)
            return response


@blueprint.route('/api/get_member_information', methods=['POST'])
@check_account_state_decoration
def get_member_information():

    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    pager = request.get_json()['pager']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select grade from auth where id=%s', [session['userId']])
        thisUser = cursor.fetchone()

        cursor.execute('select * from auth where id between %s and %s', [7*pager-6, 7*pager])
        rows = cursor.fetchall()

        cursor.execute('select count(*) from auth')
        count = cursor.fetchone()                          

    if thisUser['grade'] == 'master' or thisUser['grade'] == 'admin':
        response = {'result': '000000', 'rows': rows, 'count': count}
    else:
        response = {'result': '000010'}

    response = jsonify(response)
    return response


@blueprint.route('/api/change_member_information', methods=['POST'])
@check_account_state_decoration
def change_member_information():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    name = request.get_json()['name']
    password = request.get_json()['password']
    password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')
    grade = request.get_json()['grade']
    state = request.get_json()['state']
    memberId = request.get_json()['memberId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('select grade from auth where id=%s', [memberId])
        MemberGrade = cursor.fetchone()

        if session['userGrade'] != 'master' and session['userGrade'] != 'admin':
            response = {'result': '000010'}
            response = jsonify(response)
            return response
        elif session['userGrade'] != 'master' and MemberGrade['grade'] == 'master':
            response = {'result': '000020'}
            response = jsonify(response)
            return response

        if password != '':
            cursor.execute('UPDATE auth SET name = %s, password = %s, grade = %s, state = %s where id = %s', [name, password, grade, state, memberId])
        else:
            cursor.execute('UPDATE auth SET name = %s, grade = %s, state = %s where id = %s', [name, grade, state, memberId])
        db.commit()

    if memberId == session['userId']:
        session['userName'] = name
        session['userGrade'] = grade

    response = {'result': '000000'}
    response = jsonify(response)
    return response


@blueprint.route('/api/logout_member', methods=['POST'])
@check_account_state_decoration
def logout_member():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    memberId = request.get_json()['memberId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('select grade from auth where id=%s', [memberId])
        thisMember = cursor.fetchone()

        if session['userGrade'] != 'master' and session['userGrade'] != 'admin':
            response = {'result': '000010'}
            response = jsonify(response)
            return response
        elif session['userGrade'] != 'master' and thisMember['grade'] == 'master':
            response = {'result': '000020'}
            response = jsonify(response)
            return response

        cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', memberId])
        db.commit()

    if memberId == session['userId']:
        session.clear()

    response = {'result': '000000'}
    response = jsonify(response)
    return response


@blueprint.route('/api/alarm', methods=['POST'])
@check_account_state_decoration
def alarm():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    userId = request.get_json()['userId']
    memberId = request.get_json()['memberId']
    message = request.get_json()['message']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('select grade from auth where id=%s', [userId])
        thisUser= cursor.fetchone()

        cursor.execute('select login_check, grade from auth where id=%s', [memberId])
        row = cursor.fetchone()
        
        if thisUser['grade'] != 'master' and thisUser['grade'] != 'admin':
            response = {'result': '000010'}
            response = jsonify(response)
            return response
        elif row['login_check'] == 'C':
            response = {'result': '000000'}
            response = jsonify(response)
            return response
        elif row['login_check'] == 'D':
            cursor.execute('insert into message (user_id, message) values(%s, %s)', [memberId, message])
            db.commit()
            response = {'result': '000020'}
            response = jsonify(response)
            return response
