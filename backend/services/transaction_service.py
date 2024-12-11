from datetime import date, datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from model import Finance_Transaction

class TransactionService:

    def __init__(self):
        pass

    def read_finance_transactions(
        self,
        db: Session,
        start_date: str,
        end_date: str,
    ):
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

        transactions = (
            db.query(Finance_Transaction)
            .filter(Finance_Transaction.transaction_date >= start_date_parsed, Finance_Transaction.transaction_date <= end_date_parsed)
            .options(
                joinedload(Finance_Transaction.labels),
            )
            .order_by(Finance_Transaction.transaction_date.desc())
            .all()
        )

        return transactions
    
    def read_finance_transaction(self, db: Session, transaction_id: int):
        transaction = (
            db.query(Finance_Transaction)
            .filter(Finance_Transaction.id == transaction_id)
            .options(
                joinedload(Finance_Transaction.labels),
            )
            .first()
        )
        return transaction