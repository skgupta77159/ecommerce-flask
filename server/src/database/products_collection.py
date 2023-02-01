from flask import current_app
from . import get_database
from bson import ObjectId

db = get_database()
product_collection = db.products
admin_collection = db.admins
product_collection.create_index(
    [("product_name", "text"), ("store_id", "text")])


# Add new product in DB
def push_product(product):
    try:
        _id = product_collection.insert_one(product)
        product_id = _id.inserted_id
        user = db.admins.find_one({"_id": ObjectId(product["store_id"])})
        user["store_items"].append(str(product_id))
        db.admins.replace_one({'_id': user['_id']}, user)
        return True

    except Exception as e:
        return current_app.logger.info(e)


# Update product in DB
def update_product(product):
    try:
        newProduct = product_collection.find_one(
            {"_id": ObjectId(product["_id"])})
        newProduct["product_name"] = product["product_name"],
        newProduct["product_description"] = product["product_description"],
        newProduct["product_image"] = product["product_image"],
        newProduct["product_price"] = product["product_price"],
        newProduct["product_category"] = product["product_category"]

        product_collection.replace_one(
            {"_id": ObjectId(product["_id"])}, newProduct)
        return True

    except Exception as e:
        return current_app.logger.info(e)


# Delete the single product with product_id
def delete_product(product_id):
    try:
        product_collection.delete_one({"_id": ObjectId(product_id)})
        return True

    except Exception as e:
        return current_app.logger.info(e)


# Returns all store products
def get_store_products(store_id):
    try:
        products = product_collection.find({"store_id": store_id})
        list = []
        for i in products:
            item = {
                '_id': str(i["_id"]),
                'product_name': i["product_name"],
                'product_description': i["product_description"],
                'product_image': i["product_image"],
                'product_price': i["product_price"],
                'product_category': i["product_category"],
                'rating': i["rating"],
                'comments': i["comments"]
            }
            list.append(item)
        return list

    except Exception as e:
        return current_app.logger.info(e)


# Returns single product by product_id
def get_single_product(product_id):
    try:
        product = product_collection.find_one({"_id": ObjectId(product_id)})
        if product:
            item = {
                '_id': str(product["_id"]),
                'product_name': product["product_name"],
                'product_description': product["product_description"],
                'product_image': product["product_image"],
                'product_price': product["product_price"],
                'product_category': product["product_category"],
                'store_id': product["store_id"],
                'rating': product["rating"],
                'comments': product["comments"]
            }
            return {"data": item}
        return {"error": "Item not found"}

    except Exception as e:
        return current_app.logger.info(e)


# Return all random product
def get_all_product():
    try:
        result = product_collection.find()
        if result:
            products = []
            for item in result:
                content = {
                    '_id': str(item["_id"]),
                    'product_name': item["product_name"],
                    'product_description': item["product_description"],
                    'product_image': item["product_image"],
                    'product_price': item["product_price"],
                    'product_category': item["product_category"],
                    'store_id': item["store_id"],
                    'rating': item["rating"],
                    'comments': item["comments"]
                }
                products.append(content)
            return {"products": products}

        return {"error": "failed to fetch data"}
    except Exception as e:
        return current_app.logger.info(e)


# Get all search product
def get_search_product(query):
    try:
        store = admin_collection.find(
            {str("address_list."+query["loc_name"]): query["loc"]})
        storeId = []
        storeData = {}
        if store:
            for i in store:
                item = {
                    "_id": str(i["_id"]), 
                    "latitude": i["latitude"],
                    "longitude": i["longitude"],
                    "store_name": i['store_name'],
                    "store_description": i['store_description'],
                    "store_address": i['store_address'],
                }
                storeData[str(i["_id"])] = item
                storeId.append(str(i["_id"]))

        result = product_collection.find(
            {"$text": {"$search": query["product_name"]}}).limit(10)
        product_list = []
        store_list = []
        if result:
            for i in result:
                if i["store_id"] in storeId:
                    item = {
                        '_id': str(i["_id"]),
                        'product_name': i["product_name"],
                        'product_description': i["product_description"],
                        'product_image': i["product_image"],
                        'product_price': i["product_price"],
                        'product_category': i["product_category"],
                        "store_id": i["store_id"],
                        'rating': i["rating"],
                        'comments': i["comments"]
                    }
                    store_list.append(storeData[i["store_id"]])
                    product_list.append(item)

            if len(product_list)==0:
                return {"products": product_list, "stores": []}
            return {"products": product_list, "stores": list({v['_id']:v for v in store_list}.values())}
        return {"error": "Search Failed"}

    except Exception as e:
        return current_app.logger.info(e)


        
