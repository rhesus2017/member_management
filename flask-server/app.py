from flask import Flask
from views import index
from views import auth

app = Flask(__name__)

app.register_blueprint(index.blueprint, url_prefix='/')
app.register_blueprint(auth.blueprint, url_prefix='/auth')

if __name__ == '__main__':
    app.secret_key = 'secret_key'
    app.run(port=5000)
    # app.run(host='0.0.0.0')
