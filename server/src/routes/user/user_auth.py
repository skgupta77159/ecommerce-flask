from flask import Blueprint, request, current_app, jsonify
from src.database.user_collection import signup_user, signin_user, logout_user
from src.middleware.user_auth_middleware import user_token_required

user_auth = Blueprint("user_auth", __name__)


@user_auth.route("/sign-up", methods=['POST'])
def user_signup():
    try:
        data = {
            "name": request.json["name"],
            "email": request.json["email"],
            "password": request.json["password"],
            "cpassword": request.json["cpassword"]
        }
        if request.json["password"] != request.json["cpassword"]:
            return jsonify(error='Password and confirm password does not match!'), 401

        res = signup_user(data)
        if "userAuthToken" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable, try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_auth.route("/sign-in", methods=['POST'])
def user_signin():
    try:
        data = {
            "email": request.json["email"],
            "password": request.json["password"]
        }
        res = signin_user(data)
        if "userAuthToken" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable, try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_auth.route("/logout", methods=['DELETE'])
@user_token_required
def user_logout(user_detail):
    try:
        data = {
            "userAuthToken": request.headers["Authorization"].split(" ")[1]
        }
        res = logout_user(data)
        if "success" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable, try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_auth.route("/check-userauth", methods=['GET'])
@user_token_required
def check_user_auth(user_detail):
    try:
        return jsonify(user_detail), 201
    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500

        
