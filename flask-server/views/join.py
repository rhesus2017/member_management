from flask import jsonify, request, Blueprint, session
from flask.globals import session
from functools import wraps
import pymysql
import random
import logging
import bcrypt 


logger = logging.getLogger(__name__)
blueprint = Blueprint('join', __name__)


@blueprint.route('/api/join', methods=['POST'])
def join():
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

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
                    if 'certification_number' not in session or certification != session['certification_number'] or phone != session['phone_number']:
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

        if 'certification_number' not in session or certification != session['certification_number'] or phone != session['phone_number']:
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

    response = {'result': '000000', 'certification_number': certification_number}
    response = jsonify(response)
    return response
