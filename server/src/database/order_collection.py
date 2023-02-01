from flask import current_app
from . import get_database
from bson import ObjectId
from textblob import TextBlob
import datetime
import pymongo

db = get_database()
order_collection = db.orders
user_collection = db.users


# create order in DB
def create_order(data):
    try:
        result = order_collection.insert_one({
            "product_id": data["product_id"],
            "user_id": data["user_id"],
            "store_id": data["store_id"],
            "product_name": data["product_name"],
            "quantity": data["quantity"],
            "status": "Processing",
            "review": "",
            "sentiment": 2,
            "user_name": data["user_name"],
            "total_price": data["total_price"],
            "delivery_address": data["delivery_address"],
            "product_price": data["product_price"],
            "product_image": data["product_image"],
            "payment_mode": data["payment_mode"],
            "createdAt": datetime.datetime.now(),
            "updatedAt": datetime.datetime.now(),
        })
        if result:
            return {"success": "Order created successfully"}
        return {"error": "Failed to create order"}

    except Exception as e:
        current_app.logger.info(e)


# delete order from DB
def delete_order(order_id):
    try:
        order = order_collection.find_one({"_id": ObjectId(order_id)})
        if order:
            result = order_collection.delete_one({"_id": ObjectId(order_id)})
            if result:
                return {"success": "Order deleted successfully"}
            return {"error": "Failed to delete order"}
        return {"error": "No order found with the provided id"}

    except Exception as e:
        current_app.logger.info(e)


# Returns all the users orders
def get_user_orders(user_id):
    try:
        orders = order_collection.find({"user_id": user_id}).sort('createdAt', pymongo.DESCENDING)
        if orders:
            all_order = []
            for item in orders:
                all_order.append({
                    "_id": str(item["_id"]), 
                    "product_id": item["product_id"], 
                    "user_id": item["user_id"], 
                    "store_id": item["store_id"], 
                    "product_name": item["product_name"], 
                    "product_image": item["product_image"],
                    "quantity": item["quantity"], 
                    "status": item["status"],
                    "review": item["review"],
                    "sentiment": item["sentiment"],
                    "total_price": item["total_price"], 
                    "delivery_address": item["delivery_address"], 
                    "product_price": item["product_price"], 
                    "payment_mode": item["payment_mode"], 
                    "createdAt": item["createdAt"],
                })
            return {"data": all_order}
        return {"error": "No orders found"}

    except Exception as e:
        current_app.logger.info(e)


# Returns all the Admin orders
def get_admin_orders(admin_id):
    try:
        orders = order_collection.find({"store_id": admin_id}).sort('createdAt', pymongo.DESCENDING)
        if orders:
            all_order = []
            for item in orders:
                all_order.append({
                    "_id": str(item["_id"]), 
                    "product_id": item["product_id"], 
                    "user_id": item["user_id"], 
                    "store_id": item["store_id"], 
                    "product_name": item["product_name"], 
                    "product_image": item["product_image"],
                    "quantity": item["quantity"], 
                    "status": item["status"],
                    "review": item["review"],
                    "sentiment": item["sentiment"],
                    "user_name": item["user_name"],
                    "total_price": item["total_price"], 
                    "delivery_address": item["delivery_address"], 
                    "product_price": item["product_price"], 
                    "payment_mode": item["payment_mode"], 
                    "createdAt": item["createdAt"],
                })
            return {"data": all_order}
        return {"error": "No orders found"}

    except Exception as e:
        current_app.logger.info(e)


# Add user review on product
def add_review(data):
    try:
        order = order_collection.find_one({"_id": ObjectId(data["order_id"])})
        pred = TextBlob(data["review"]).sentiment.polarity
        if (pred >= 0):
            sentiment = 1
        else:
            sentiment = 0
        if order:
            order["review"] = data["review"]
            order["sentiment"] = sentiment
            order["updatedAt"] = datetime.datetime.now()
            order_collection.replace_one({'_id': order['_id']}, order)
            return {"success": "Product review added"}
        return {"error": "Failed to add review"}

    except Exception as e:
        current_app.logger.info(e)

        
# Get all review of single product
def get_product_review(product_id):
    try:
        cursor = order_collection.find({"$and": [{"product_id": product_id}, {"status": "Delivered"}, {"review": {"$ne":""}}]}).sort('updatedAt', pymongo.DESCENDING)
        reviews=[]
        if cursor:
            for item in cursor:
                user = user_collection.find_one({"_id": ObjectId(item["user_id"])})
                reviews.append({
                    "review": item["review"],
                    "updatedAt": item["updatedAt"],
                    "sentiment": item["sentiment"],
                    "user_name": user["name"]
                })
            return {"data": reviews}
        return {"error": "Failed to get review"}
        
    except Exception as e:
        current_app.logger.info(e)


# Change the order status by admin
def set_order_status(data):
    try:
        order = order_collection.find_one({"_id": ObjectId(data["order_id"])})
        if order:
            order["status"] = data["status"]
            order["updatedAt"] = datetime.datetime.now()
            order_collection.replace_one({'_id': order['_id']}, order)
            return {"success": "Status updated successfully"}

        return {"error": "No order found with the provided id"}

    except Exception as e:
        current_app.logger.info(e)