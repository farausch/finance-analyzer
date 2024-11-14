from fastapi import FastAPI, Depends, File, UploadFile
from sqlalchemy.orm import Session
from config.db_config import engine, SessionLocal
from services.import_service import ImportService
from config.import_config import Provider
from model import Finance_Transaction, Base
from services.label_service import LabelService

Base.metadata.create_all(bind=engine)

import_service = ImportService()
label_service = LabelService()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/transactions/")
def read_finance_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    transactions = db.query(Finance_Transaction).offset(skip).limit(limit).all()
    return transactions

@app.post("/transactions/import-csv/")
async def import_csv(provider: Provider, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return await import_service.import_data(provider, file.filename, file, db)

@app.post("/transactions/add-label")
def add_label_to_transaction(transaction_id: int, label_id: int, db: Session = Depends(get_db)):
    return label_service.add_label_to_transaction(db, transaction_id, label_id)

@app.post("/labels/create/")
def create_label(name: str, display_name: str, db: Session = Depends(get_db)):
    return label_service.create_label(db, name, display_name)