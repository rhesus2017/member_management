from flask import render_template, Blueprint
from flask_cors import CORS
import logging

logger = logging.getLogger(__name__)
blueprint = Blueprint('index', __name__)
cors = CORS(blueprint, resources={r"/*": {"origins": "*"}})


@blueprint.route('/', defaults={'path': ''})
@blueprint.route('/<path:path>')
def index(path):
    return render_template('index.html')
