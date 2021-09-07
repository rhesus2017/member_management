from flask import jsonify, request, session
from functools import wraps
import pymysql


def check_account_state_decoration(f):
  @wraps(f)
  def decoratored_function(*args, **kwargs):
    db = pymysql.connect(host='127.0.0.1', user='root', passwd='root123', db='member_management', charset='utf8', port=3306)

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
