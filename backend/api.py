from datetime import date, datetime
from fastapi import FastAPI, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session, joinedload
from config.db_config import engine, SessionLocal
from services.import_service import ImportService
from config.import_config import Provider
from model import Finance_Category, Finance_Label, Finance_Transaction, Base, Finance_Transaction_Category, Finance_Transaction_Label
from services.label_service import LabelService
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

import_service = ImportService()
label_service = LabelService()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origin(s) for production
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
    # Parse start_date and end_date
    if not start_date:
        start_date_parsed = date.today().replace(day=1)
    else:
        try:
            start_date_parsed = datetime.strptime(start_date, "%d.%m.%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use DD.MM.YYYY format.")

    if not end_date:
        end_date_parsed = date.today()
    else:
        try:
            end_date_parsed = datetime.strptime(end_date, "%d.%m.%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use DD.MM.YYYY format.")

    if start_date_parsed > end_date_parsed:
        raise HTTPException(status_code=400, detail="start_date must be before or equal to end_date")

    # Query transactions with labels and categories using joins
    transactions = (
        db.query(Finance_Transaction)
        .filter(Finance_Transaction.transaction_date >= start_date_parsed, Finance_Transaction.transaction_date <= end_date_parsed)
        .options(
            joinedload(Finance_Transaction.labels),
            joinedload(Finance_Transaction.categories)
        )
        .order_by(Finance_Transaction.transaction_date.desc())
        .all()
    )

    # Format the result
    result = []
    for transaction in transactions:
        labels = [label for label in transaction.labels]
        categories = [category for category in transaction.categories]

        result.append({
            "transaction": transaction,
            "labels": labels,
            "categories": categories
        })

    return result

@app.post("/transactions/import-csv/")
async def import_csv(provider: Provider, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return await import_service.import_data(provider, file.filename, file, db)

@app.post("/transactions/add-label")
def add_label_to_transaction(transaction_id: int, label_id: int, db: Session = Depends(get_db)):
    return label_service.add_label_to_transaction(db, transaction_id, label_id)

@app.post("/labels/create/")
def create_label(name: str, display_name: str, db: Session = Depends(get_db)):
    return label_service.create_label(db, name, display_name)