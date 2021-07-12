import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
import logging
from logging.handlers import TimedRotatingFileHandler
from views import index
from views import information
from views import join
from views import login
from views import member_management
from views import top_nav
from views import message

logger = logging.getLogger()
logger.setLevel('INFO')
formatter = logging.Formatter('%(asctime)s %(process)d %(levelname)1.1s %(lineno)3s:%(funcName)-16.16s %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)

current_dir = os.path.dirname(os.path.abspath(__file__))
current_filename = os.path.splitext(os.path.basename(__file__))[0]
filename = current_dir + os.sep + "log" + os.sep + current_filename + ".log"
handler = TimedRotatingFileHandler(filename=filename, when='midnight', backupCount=7, encoding='utf8')
handler.suffix = '%Y%m%d'
handler.setFormatter(formatter)
logger.addHandler(handler)

app = Flask(__name__)

app.register_blueprint(index.blueprint, url_prefix='/')
app.register_blueprint(information.blueprint, url_prefix='/')
app.register_blueprint(join.blueprint, url_prefix='/')
app.register_blueprint(login.blueprint, url_prefix='/')
app.register_blueprint(member_management.blueprint, url_prefix='/')
app.register_blueprint(top_nav.blueprint, url_prefix='/')
app.register_blueprint(message.blueprint, url_prefix='/')

if __name__ == '__main__':
    app.secret_key = 'secret_key'
    app.run(host='0.0.0.0', port=5000)
