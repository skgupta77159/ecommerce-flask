from flask import Blueprint, jsonify, request, current_app
from src.middleware.admin_auth_middleware import admin_token_required
from src.database.admin_collection import signin_admin, signup_admin, logout_admin

admin_auth = Blueprint('admin_auth', __name__)


@admin_auth.route('/sign-up', methods=['POST'])
def admin_signup():
    try:
        data = {
            "name": request.json['name'],
            "email": request.json['email'],
            "password": request.json["password"],
            "cpassword": request.json["cpassword"],
            "store_name": request.json['store_name'],
            "store_description": request.json['store_description'],
            "store_address": request.json['store_address'],
            "latitude": request.json['latitude'],
            "longitude": request.json['longitude'],
            "address_list": request.json['address_list'],
        }
        res = signup_admin(data)
        if "adminAuthToken" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401
        return jsonify({"error": "Service unavailable, try again laster"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_auth.route('/sign-in', methods=['POST'])
def admin_signin():
    try:
        data = {
            "email": request.json['email'],
            "password": request.json['password']
        }
        res = signin_admin(data)
        if "adminAuthToken" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401
        return jsonify({"error": "Service unavailable, try again laster"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_auth.route('/logout', methods=['DELETE'])
@admin_token_required
def admin_logout(admin_detail):
    try:
        data = {
            "adminAuthToken": request.headers["Authorization"].split(" ")[1]
        }
        res = logout_admin(data)
        if "success" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable, try again laster"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_auth.route('/checkauth', methods=['GET'])
@admin_token_required
def check_admin_auth(admin_detail):
    try:
        return jsonify(admin_detail), 201
    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500
