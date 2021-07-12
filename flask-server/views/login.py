from flask import jsonify, request, Blueprint, session
from flask.globals import session, current_app
from datetime import timedelta
import pymysql
import logging
import bcrypt 


logger = logging.getLogger(__name__)
blueprint = Blueprint('login', __name__)


@blueprint.route('/api/login', methods=['POST'])
def login():
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='react_example', charset='utf8', port=3306)

    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=30)

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
