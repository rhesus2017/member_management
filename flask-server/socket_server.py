import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_socketio import SocketIO, emit
import logging
from logging.handlers import TimedRotatingFileHandler

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
app.config['JSON_AS_ASCII'] = False
app.debug = True

socketio = SocketIO()
socketio.init_app(app, cors_allowed_origins="*")


@socketio.on('sendMessage')
def sendMessage(data):
    socketio.emit('receiveMessage', data)


@socketio.on('confirmResult')
def confirmResult(data):
    socketio.emit('confirmResult', data)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5050)