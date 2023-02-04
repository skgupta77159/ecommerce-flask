from flask import Flask, has_request_context, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import logging
import os


# using custom formatter to inject contextual data into logging
class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None
        return super().format(record)


# create a formatter object
formatter = RequestFormatter(
    '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
    '%(levelname)s in %(module)s: %(message)s'
)


# add console handler to the root logger
logger = logging.getLogger()
consoleHandler = logging.StreamHandler()
consoleHandler.setFormatter(formatter)
logger.addHandler(consoleHandler)

# add file handler to the root logger
fileHandler = logging.FileHandler("logs.log")
fileHandler.setFormatter(formatter)
logger.addHandler(fileHandler)


def create_app():
    app = Flask(__name__)
    JWTManager(app)
    CORS(app)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)

    # Blueprint imports
    from .routes.admin.admin_auth import admin_auth
    from .routes.admin.admin_product import admin_product
    from .routes.public.product_info import product_info
    from .routes.user.user_auth import user_auth
    from .routes.user.user_product import user_product

    # blueprint for all the endpoints
    app.register_blueprint(admin_auth, url_prefix='/api/admin/auth')
    app.register_blueprint(admin_product, url_prefix="/api/admin/product")
    app.register_blueprint(product_info, url_prefix="/api/public/product")
    app.register_blueprint(user_auth, url_prefix="/api/user/auth")
    app.register_blueprint(user_product, url_prefix="/api/user/product")

    return app
