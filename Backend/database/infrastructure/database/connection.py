import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = URL.create(
    "mysql+mysqlconnector",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.environ.get("DB_PORT", "3306")),
    database=os.environ["DB_NAME"],
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionFactory = sessionmaker(bind=engine, expire_on_commit=False)