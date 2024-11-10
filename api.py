import csv
from io import StringIO
from fastapi import FastAPI, Depends, File, UploadFile
from sqlalchemy.orm import Session
from db_config import engine, SessionLocal
from import_service import ImportService
from mapping_config import LZO_MAPPING
from model import Finance_Transaction, Base

Base.metadata.create_all(bind=engine)

import_service = ImportService()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/finance_transactions/", response_model=dict)
def create_finance_transaction(transaction_date: str,
                               value: float,
                               description: str,
                               recipient: str,
                               db: Session = Depends(get_db)):
    db_finance_transaction = Finance_Transaction(transaction_date=transaction_date, value=value, description=description, recipient=recipient)
    db.add(db_finance_transaction)
    db.commit()
    db.refresh(db_finance_transaction)
    return {"id": db_finance_transaction.id, "transaction_date": db_finance_transaction.transaction_date, "value": db_finance_transaction.value, "description": db_finance_transaction.description, "recipient": db_finance_transaction.recipient}

@app.get("/finance_transactions/")
def read_finance_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    transactions = db.query(Finance_Transaction).offset(skip).limit(limit).all()
    return transactions

@app.post("/import_csv/")
async def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return import_service.import_data(file, db)