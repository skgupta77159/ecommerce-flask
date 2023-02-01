from flask import Blueprint, request, current_app, jsonify
from src.database.user_collection import add_to_cart, remove_from_cart, get_cart_items, empty_cart
from src.middleware.user_auth_middleware import user_token_required
from src.database.order_collection import create_order, delete_order, get_user_orders, add_review

user_product = Blueprint("user_product", __name__)


@user_product.route("/addtocart", methods=['PUT'])
@user_token_required
def add_cart_item(user_detail):
    try:
        cartItem = {
            'user_id': user_detail['_id'],
            'product_id': request.json['product_id']
        }
        res = add_to_cart(cartItem)
        if "success" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/removefromcart", methods=['PUT'])
@user_token_required
def remove_cart_item(user_detail):
    try:
        cartItem = {
            'user_id': user_detail['_id'],
            'product_id': request.json['product_id']
        }
        res = remove_from_cart(cartItem)
        if "success" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/getcartitem", methods=['GET'])
@user_token_required
def get_user_cart(user_detail):
    try:
        res = get_cart_items(user_detail)
        if "data" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/createorder", methods=['POST'])
@user_token_required
def order_product(user_detail):
    try:
        order_detail = request.get_json()
        order_detail["user_id"] = user_detail["_id"]
        order_detail["user_name"] = user_detail["name"]
        res = create_order(order_detail)
        if "success" in res:
            empty_cart(user_detail)
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/cancelorder", methods=['PUT'])
@user_token_required
def cancel_order(user_detail):
    try:
        order_id = request.get_json().get("order_id")
        res = delete_order(order_id)
        if "success" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/getorders", methods=['GET'])
@user_token_required
def get_order(user_detail):
    try:
        res = get_user_orders(user_detail["_id"])
        if "data" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@user_product.route("/writereview", methods=['POST'])
@user_token_required
def write_review(user_detail):
    try:
        res = add_review(request.get_json())
        if "success" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500
