from flask import current_app
from flask_jwt_extended import create_access_token
from . import get_database
from bson import ObjectId
import bcrypt
import datetime

db = get_database()
user_collection = db.users
product_collection = db.products


# Sign-up new user
def signup_user(data):
    try:
        user = user_collection.find_one({"email": data["email"]})

        if user:
            return {"error": "Email already exist!"}

        hash_pass = bcrypt.hashpw(
            data["password"].encode('utf-8'), bcrypt.gensalt()
        )
        access_token = create_access_token(identity=data["email"])

        user_collection.insert_one({
            "name": data["name"],
            "email": data["email"],
            "password": hash_pass,
            "cart_products": [],
            "tokens": [
                {
                    'token': str(access_token)
                }
            ],
            "createdAt": datetime.datetime.now(),
            "updatedAt": datetime.datetime.now(),
        })
        return {"userAuthToken": access_token}

    except Exception as e:
        current_app.logger.info(e)


# Sign-in user
def signin_user(data):
    try:
        user = user_collection.find_one({"email": data["email"]})
        if user:
            if bcrypt.hashpw(data['password'].encode('utf-8'), user['password']) == user['password']:
                access_token = create_access_token(identity=data['email'])
                user['tokens'].append({'token': str(access_token)})
                user_collection.replace_one({'_id': user['_id']}, user)
                return {"userAuthToken": access_token}

        return {"error": "Invalid Email/Password"}

    except Exception as e:
        current_app.logger.info(e)


# logout user
def logout_user(data):
    try:
        user = user_collection.find_one({"tokens.token": data['userAuthToken']})
        if user:
            user["tokens"] = []
            user_collection.replace_one({'_id': user['_id']}, user)
            return {"success": "logout successfully"}

        return {"error": "logout failed"}

    except Exception as e:
        current_app.logger.info(e)


# Add product to user cart
def add_to_cart(data):
    try:
        user = user_collection.find_one({'_id': ObjectId(data["user_id"])})
        if user:
            if data["product_id"] in user["cart_products"]:
                return {"error": "Item already added"}
            user["cart_products"].append(data["product_id"])
            user_collection.replace_one({'_id': user['_id']}, user)

            return {"success": "Item added successfully"}
        return {"error": "Failed to add item in cart"}

    except Exception as e:
        current_app.logger.info(e)


# Remove product from user cart
def remove_from_cart(data):
    try:
        user = user_collection.find_one({'_id': ObjectId(data["user_id"])})
        if user:
            if data["product_id"] not in user["cart_products"]:
                return {"error": "Item not found in cart"}
            user["cart_products"].remove(data["product_id"])
            user_collection.replace_one({'_id': user['_id']}, user)

            return {"success": "Item removed successfully"}
        return {"error": "Failed to remove item from cart"}

    except Exception as e:
        current_app.logger.info(e)


# Get all user cart product
def get_cart_items(user_detail):
    try:
        user = user_collection.find_one({'_id': ObjectId(user_detail["_id"])})

        if user:
            objectIdArray = []
            for id in user["cart_products"]:
                objectIdArray.append(ObjectId(id))
            res = product_collection.find({"_id" : { "$in" : objectIdArray} } )
            product_list = []
            for item in res:
                product_list.append({
                '_id': str(item["_id"]),
                "user_id": user_detail["_id"],
                "user_name": user_detail["name"],
                'store_id': item["store_id"],
                'product_name': item["product_name"],
                'product_image': item["product_image"],
                'product_price': item["product_price"]
            })
            return {"data": product_list}
        return {"error": "Failed to get cart item"}

    except Exception as e:
        current_app.logger.info(e)



# Clear items from user cart
def empty_cart(user_detail):
    try:
        user = user_collection.find_one({'_id': ObjectId(user_detail["_id"])})
        if user:
            user["cart_products"] = []
            user_collection.replace_one({'_id': user['_id']}, user)
            return {"success": "Cart empty successful"}
        return {"error": "operation failed"}
        
    except Exception as e:
        current_app.logger.info(e)


        