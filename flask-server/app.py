# flask
from flask import (Flask, render_template)

# view
from views import home
from views import first
from views import second
from views import third
from views import join
from views import login

app = Flask(__name__)

# blueprint
app.register_blueprint(home.blueprint, url_prefix='/')
app.register_blueprint(first.blueprint, url_prefix='/First/')
app.register_blueprint(second.blueprint, url_prefix='/Second/')
app.register_blueprint(third.blueprint, url_prefix='/Third/')
app.register_blueprint(join.blueprint, url_prefix='/Join/')
app.register_blueprint(login.blueprint, url_prefix='/Login/')

if __name__ == '__main__':
    app.secret_key = 'secret_key'
    app.run(host='0.0.0.0')
