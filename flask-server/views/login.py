from flask import render_template, Blueprint

blueprint = Blueprint('login', __name__)


@blueprint.route('/Login/')
def login():
    return render_template('index.html', flask_token="react_with_flask")