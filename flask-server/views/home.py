from flask import render_template, Blueprint

blueprint = Blueprint('home', __name__)


@blueprint.route('/')
def home():
    return render_template('index.html', flask_token="react_with_flask")