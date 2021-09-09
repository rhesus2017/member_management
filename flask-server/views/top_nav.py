from flask import jsonify, request, Blueprint, session
from flask.globals import session
import logging
import pymysql
from .decoration.decoration import check_account_state_decoration


logger = logging.getLogger(__name__)
blueprint = Blueprint('auth', __name__)


@blueprint.route('/api/check_message', methods=['POST'])
@check_account_state_decoration
def check_message():
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    userId = request.get_json()['userId']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('select state from message where user_id = %s', [userId])
        rows = cursor.fetchall()

        for row in rows:
            if row['state'] == 'new':
                response = {'result': '000000'}
                response = jsonify(response)
                return response

        response = {'result': '000010'}
        response = jsonify(response)
        return response


@blueprint.route('/api/logout', methods=['POST'])
@check_account_state_decoration
def logout():
    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('UPDATE auth SET login_check = %s where id = %s', ['D', session['userId']])
        db.commit()
        session.clear()
        response = {'result': '000000'}
        response = jsonify(response)
        return response
