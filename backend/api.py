from fastapi import FastAPI, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session
from config.db_config import engine, SessionLocal
from services.import_service import ImportService
from config.import_config import Provider
from model import Base
from services.label_service import LabelService
from fastapi.middleware.cors import CORSMiddleware
from services.transaction_service import TransactionService

Base.metadata.create_all(bind=engine)

import_service = ImportService()
label_service = LabelService()
transaction_service = TransactionService()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/transactions/")
def read_finance_transactions(
    start_date: str = Query(None, description="Start date in DD.MM.YYYY format"),
    end_date: str = Query(None, description="End date in DD.MM.YYYY format"),
    db: Session = Depends(get_db)
):
    return transaction_service.read_finance_transactions(db, start_date, end_date)

@app.post("/transactions/import-csv/")
async def import_csv(provider: Provider, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return await import_service.import_data(provider, file.filename, file, db)

@app.post("/transactions/add-label")
def add_label_to_transaction(transaction_id: int, label_id: int, db: Session = Depends(get_db)):
    return label_service.add_label_to_transaction(db, transaction_id, label_id)

@app.post("/transactions/auto-label")
def add_label_by_keyword(keyword: str, label_id: int, db: Session = Depends(get_db)):
    return label_service.add_label_by_keyword(db, keyword, label_id)

@app.get("/transactions/grouped-by-label")
def read_finance_transactions_grouped_by_label(
    start_date: str = Query(None, description="Start date in DD.MM.YYYY format"),
    end_date: str = Query(None, description="End date in DD.MM.YYYY format"),
    db: Session = Depends(get_db)
):
    return transaction_service.group_and_sum_transactions_by_label(db, start_date, end_date)

@app.get("/transactions/{transaction_id}")
def read_finance_transaction(transaction_id: int, db: Session = Depends(get_db)):
    return transaction_service.read_finance_transaction(db, transaction_id)

@app.get("/labels/")
def read_labels(db: Session = Depends(get_db)):
    return label_service.get_labels(db)

@app.post("/labels/")
def create_label(name: str, display_name: str, db: Session = Depends(get_db)):
    return label_service.create_label(db, name, display_name)