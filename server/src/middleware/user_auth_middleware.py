from functools import wraps
from flask import request, abort, current_app, jsonify
from src.database import get_database
from flask_jwt_extended import get_jwt_identity, jwt_required

db = get_database()
user_collection = db.users


def user_token_required(f):
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

            res = user_collection.find_one({"email": current_user})

            if {'token': token.split(" ")[1]} not in res["tokens"]:
                return jsonify(message="Invalid Authentication token!"), 401

            user_detail = {
                "_id": str(res["_id"]),
                "email": res["email"],
                "name": res["name"],
                "cart_products": res["cart_products"]
            }

        except Exception as e:
            current_app.logger.info(e)
            return jsonify(message="Something went wrong"), 500

        return f(user_detail, *args, **kwargs)

    return decorated
