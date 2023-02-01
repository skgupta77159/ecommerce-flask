from flask import current_app
from flask_jwt_extended import create_access_token
from . import get_database
from bson import ObjectId
import bcrypt
import datetime

db = get_database()
admin_collection = db.admins

# admin sign-in
def signin_admin(data):
    try:
        admin = admin_collection.find_one({"email": data['email']})
        if admin:
            if bcrypt.hashpw(data['password'].encode('utf-8'), admin['password']) == admin['password']:
                access_token = create_access_token(identity=data['email'])
                admin['tokens'].append({'token': str(access_token)})
                admin_collection.replace_one({'_id': admin['_id']}, admin)
                return {"adminAuthToken": access_token}

        return {"error": "Invalid Email/Password"}

    except Exception as e:
        current_app.logger.info(e)


# admin sign-up
def signup_admin(data):
    try:
        admin = admin_collection.find_one({"email": data["email"]})
        if admin:
            return {"error": "Email Already Exist"}

        if data["password"] != data["cpassword"]:
            return {"error": "Password and confirm password does not match!"}

        hash_pass = bcrypt.hashpw(
            data["password"].encode('utf-8'), bcrypt.gensalt()
        )
        access_token = create_access_token(identity=data['email'])

        admin_collection.insert_one({
            "name": data['name'],
            "email": data['email'],
            "password": hash_pass,
            "store_name": data['store_name'],
            "store_description": data['store_description'],
            "store_address": data['store_address'],
            "latitude": data['latitude'],
            "longitude": data['longitude'],
            "address_list": data['address_list'],
            "store_items": [],
            "tokens": [
                {
                    'token': str(access_token)
                }
            ],
            "createdAt": datetime.datetime.now(),
            "updatedAt": datetime.datetime.now(),
        })
        return {"adminAuthToken": access_token}

    except Exception as e:
        current_app.logger.info(e)


# admin logout
def logout_admin(data):
    try:
        admin = admin_collection.find_one({"tokens.token": data['adminAuthToken']})
        if admin:
            admin["tokens"] = []
            admin_collection.replace_one({'_id': admin['_id']}, admin)
            return {"success": "Logout Successfully"}
        return {"error": "logout failed"}

    except Exception as e:
        current_app.logger.info(e)
