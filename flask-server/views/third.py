from flask import render_template, Blueprint

blueprint = Blueprint('third', __name__)


@blueprint.route('/Third/')
def third():
    return render_template('index.html', flask_token="react_with_flask")