from flask import jsonify, request, Blueprint, session
from flask.globals import session
import pymysql
import logging
import bcrypt 
from .decoration.decoration import check_account_state_decoration
from datetime import datetime


logger = logging.getLogger(__name__)
blueprint = Blueprint('member_management', __name__)


@blueprint.route('/api/get_member_information', methods=['POST'])
@check_account_state_decoration
def get_member_information():

    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

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
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    name = request.get_json()['name']
    password = request.get_json()['password']
    password_bcrypt = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')
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
            cursor.execute('UPDATE auth SET name = %s, password = %s, grade = %s, state = %s where id = %s', [name, password_bcrypt, grade, state, memberId])
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
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

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
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    userId = request.get_json()['userId']
    memberId = request.get_json()['memberId']
    sender = request.get_json()['sender']
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
            cursor.execute('insert into message (user_id, sender, message, datetime) values(%s, %s, %s, %s)', [memberId, sender, message, datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
            db.commit()
            response = {'result': '000020'}
            response = jsonify(response)
            return response
