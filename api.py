from fastapi import FastAPI, Depends, File, UploadFile
from sqlalchemy.orm import Session
from config.db_config import engine, SessionLocal
from services.import_service import ImportService
from config.import_config import Provider
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

@app.get("/finance_transactions/")
def read_finance_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    transactions = db.query(Finance_Transaction).offset(skip).limit(limit).all()
    return transactions

@app.post("/import_csv/")
async def import_csv(provider: Provider, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return await import_service.import_data(provider, file.filename, file, db)