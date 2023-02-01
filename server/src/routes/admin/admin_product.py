from flask import Blueprint, current_app, request, jsonify
from src.database.products_collection import push_product, get_store_products, update_product, delete_product
from src.database.order_collection import get_admin_orders, set_order_status
from src.middleware.admin_auth_middleware import admin_token_required

admin_product = Blueprint("admin_product", __name__)


@admin_product.route("/add", methods=["POST"])
@admin_token_required
def add_product(admin_detail):
    try:
        item = {
            "product_name": request.json["product_name"],
            "product_description": request.json["product_description"],
            "product_image": request.json["product_image"],
            "product_price": request.json["product_price"],
            "product_category": request.json["product_category"],
            "store_id": request.json["store_id"],
            "rating": 0,
            "comments": []
        }

        res = push_product(item)
        if res:
            return jsonify({"success": "Successful"}), 201
        return jsonify({"error": "Service Unavailable, Try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_product.route("/edit", methods=["POST"])
@admin_token_required
def edit_product(admin_detail):
    try:
        item = {
            "product_name": request.json["product_name"],
            "product_description": request.json["product_description"],
            "product_image": request.json["product_image"],
            "product_price": request.json["product_price"],
            "product_category": request.json["product_category"],
            "_id": request.json["_id"]
        }
        res = update_product(item)
        if res:
            return jsonify({"success": "Successful"}), 201
        return jsonify({"error": "Service Unavailable, Try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_product.route("/delete", methods=["POST"])
@admin_token_required
def remove_product(admin_detail):
    try:
        res = delete_product(request.json["_id"])
        if res:
            return jsonify({"success": "Successful"}), 201
        return jsonify({"error": "Service Unavailable, Try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_product.route("/getstoreproducts", methods=["POST"])
@admin_token_required
def store_products(admin_detail):
    try:
        store_id = request.json["store_id"]
        res = get_store_products(store_id)
        if len(res) >= 0:
            return jsonify(res), 201
        return jsonify({"error": "Service Unavailable, Try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_product.route("/getorders", methods=['GET'])
@admin_token_required
def get_order(admin_detail):
    try:
        res = get_admin_orders(admin_detail["_id"])
        if "data" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@admin_product.route("/setorderstatus", methods=['PUT'])
@admin_token_required
def update_order(admin_detail):
    try:
        data = {
            "status": request.json["status"],
            "order_id": request.json["order_id"]
        }
        res = set_order_status(data)
        if "success" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500
