from flask import render_template, Blueprint

blueprint = Blueprint('first', __name__)


@blueprint.route('/First/')
def first():
    return render_template('index.html', flask_token="react_with_flask")