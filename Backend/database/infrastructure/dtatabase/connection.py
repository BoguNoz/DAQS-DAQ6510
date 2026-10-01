import os
import mysql.connector.pooling
from dotenv import load_dotenv

load_dotenv()

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="daq6510_pool",
    pool_size=5,
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)

def get_connection():
    return pool.get_connection()