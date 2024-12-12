from datetime import date, datetime
from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from model import Finance_Label, Finance_Transaction

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

    def group_and_sum_transactions_by_label(
        self, db: Session, start_date: str, end_date: str
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

        grouped_data = (
            db.query(Finance_Label, func.sum(Finance_Transaction.value).label("total_value"))
            .join(Finance_Transaction.labels)
            .filter(Finance_Transaction.transaction_date >= start_date_parsed,
                    Finance_Transaction.transaction_date <= end_date_parsed)
            .group_by(Finance_Label.id)
            .all()
        )
        return [{"label": label, "total_value": total_value} for label, total_value in grouped_data]