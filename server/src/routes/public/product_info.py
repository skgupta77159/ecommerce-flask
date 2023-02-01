from flask import Blueprint, current_app, request, jsonify
from src.database.products_collection import get_single_product, get_search_product, get_all_product
from src.database.order_collection import get_product_review

product_info = Blueprint("product_info", __name__)


@product_info.route("/getone", methods=["POST"])
def single_product():
    try:
        product_id = request.json["product_id"]
        res = get_single_product(product_id)

        if "data" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable. try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@product_info.route("/getall", methods=["GET"])
def all_products():
    try:
        res = get_all_product()

        if "products" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable. try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@product_info.route("/search", methods=["POST"])
def search_product():
    try:
        loc_name = request.json["loc_name"]
        loc = request.json["loc"]
        if loc_name == "" or loc_name == "N/A":
            loc_name = "country"
            loc = "India"
        query = {
            "product_name": request.json["product_name"],
            "loc_name": loc_name,
            "loc": loc
        }
        res = get_search_product(query)

        if "products" in res:
            return jsonify(res), 201
        elif "error" in res:
            return jsonify(res), 401

        return jsonify({"error": "Service unavailable. try again later"}), 503

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500


@product_info.route("/getproductreviews", methods=['POST'])
def get_review():
    try:
        product_id = request.get_json().get("product_id")
        res = get_product_review(product_id)
        if "data" in res:
            return jsonify(res), 201
        return jsonify(res), 401

    except Exception as e:
        current_app.logger.info(e)
        return jsonify({"error": "Internal Server Error"}), 500
