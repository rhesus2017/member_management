from flask import render_template, Blueprint

blueprint = Blueprint('second', __name__)


@blueprint.route('/Second/')
def second():
    return render_template('index.html', flask_token="react_with_flask")