from flask import jsonify, request, Blueprint, session
from flask.globals import session
import pymysql
import logging
from .decoration.decoration import check_account_state_decoration


logger = logging.getLogger(__name__)
blueprint = Blueprint('message', __name__)


@blueprint.route('/api/get_message', methods=['POST'])
@check_account_state_decoration
def get_message():

    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    pager = request.get_json()['pager']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        cursor.execute('UPDATE message SET state = CASE user_id WHEN %s THEN %s ELSE state END' , [session['userId'], 'checked'])
        db.commit()

        cursor.execute('select * from message where user_id = %s and delete_state = %s LIMIT %s, %s', [session['userId'], 'N', 7*(pager-1), 7])
        rows = cursor.fetchall()

        cursor.execute('select count(*) from message where user_id = %s and delete_state = %s', [session['userId'], 'N'])
        count = cursor.fetchone()                          

    response = {'result': '000000', 'rows': rows, 'count': count}
    response = jsonify(response)
    return response


@blueprint.route('/api/delete_message', methods=['POST'])
@check_account_state_decoration
def delete_message():

    db = pymysql.connect(host='amazon.cfu3xt0puybw.us-east-2.rds.amazonaws.com', user='amazon', passwd='amazon123', db='member_management', charset='utf8', port=3306)

    delete_numbers = request.get_json()['delete_number']

    with db.cursor(pymysql.cursors.DictCursor) as cursor:

        for delete_numbere in delete_numbers:
            cursor.execute('UPDATE message SET delete_state = %s where id = %s' , ['Y', delete_numbere])
        db.commit()              

    response = {'result': '000000'}
    response = jsonify(response)
    return response
