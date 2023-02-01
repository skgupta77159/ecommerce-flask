# import MongoClient
from pymongo import MongoClient
import os

# Creating a client
client = MongoClient(os.getenv("MONGO_URI"))


# Initialising a database named ecommerce
def get_database():
    db = client.get_database('ecommerce')
    return db
