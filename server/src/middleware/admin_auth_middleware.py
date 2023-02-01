from functools import wraps
from flask import request, abort, current_app, jsonify
from src.database import get_database
from flask_jwt_extended import get_jwt_identity, jwt_required

db = get_database()
admin_collection = db.admins


def admin_token_required(f):
    @wraps(f)
    @jwt_required
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]
        if not token:
            return jsonify(message="Authentication Token is missing!"), 401
        try:
            current_user = get_jwt_identity()
            if current_user is None:
                return jsonify(message="Invalid Authentication token!"), 401

            res = admin_collection.find_one({"email": current_user})

            if {'token': token.split(" ")[1]} not in res["tokens"]:
                return jsonify(message="Invalid Authentication token!"), 401
                
            admin_detail = {
                "_id": str(res["_id"]),
                "address_list": res["address_list"],
                "email": res["email"],
                "latitude": res["latitude"],
                "longitude": res["longitude"],
                "name": res["name"],
                "store_address": res["store_address"],
                "store_description": res["store_description"],
                "store_items": res["store_items"],
                "store_name": res["store_name"]
            }
        except Exception as e:
            current_app.logger.info(e)
            return jsonify(message="Something went wrong"), 500

        return f(admin_detail, *args, **kwargs)

    return decorated
