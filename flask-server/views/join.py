from flask import render_template, Blueprint

blueprint = Blueprint('join', __name__)


@blueprint.route('/Join/')
def join():
    return render_template('index.html', flask_token="react_with_flask")