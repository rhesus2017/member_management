from flask import jsonify, request, Blueprint, session
from flask.globals import session
import pymysql
import logging
import bcrypt
from .decoration.decoration import check_account_state_decoration


logger = logging.getLogger(__name__)
blueprint = Blueprint('information', __name__)


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
