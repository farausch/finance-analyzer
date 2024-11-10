import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from google.cloud.sql.connector import Connector

def init_connection_pool(connector: Connector):
    def getconn():
        conn = connector.connect(
            os.environ.get("GCP_PG_ID"),
            "pg8000",
            user=os.environ.get("GCP_PG_USERNAME"),
            password=os.environ.get("GCP_PG_PASSWORD"),
            db=os.environ.get("GCP_PG_DB"),
            ip_type="public"
        )
        return conn

    SQLALCHEMY_DATABASE_URL = "postgresql+pg8000://"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, creator=getconn)
    return engine

connector = Connector()
engine = init_connection_pool(connector)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
