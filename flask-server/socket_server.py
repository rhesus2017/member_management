from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.debug = True

socketio = SocketIO()
socketio.init_app(app, cors_allowed_origins="*")

@socketio.on('joined')
def joined(data):
    emit('status', {'message': 'Hello'})

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5050)