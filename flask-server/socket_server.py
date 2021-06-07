from flask import Flask, jsonify, json, make_response
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.debug = True

socketio = SocketIO()
socketio.init_app(app, cors_allowed_origins="*")

@socketio.on('first')
def first(data):
    print(data['message'])
    socketio.emit('second', {'message': 'Go To Client'})

if __name__ == '__main__':
    socketio.run(app, port=5050)