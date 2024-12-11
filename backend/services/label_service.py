from model import Finance_Label, Finance_Transaction, Finance_Transaction_Label
from sqlalchemy.orm import Session, joinedload

class LabelService:

    def __init__(self):
        pass

    def get_labels(self, db):
        labels = db.query(Finance_Label).all()
        return labels
    
    def get_label_by_name(self, db, name):
        label = db.query(Finance_Label).filter_by(name=name).first()
        return label

    def create_label(self, db, name, display_name):
        db.add(Finance_Label(name=name, display_name=display_name))
        db.commit()
        return {"message": f"Successfully created label {name}."}

    def add_label_to_transaction(self, db, transaction_id, label_id):
        db.add(Finance_Transaction_Label(transaction_id=transaction_id, label_id=label_id))
        db.commit()
        return {"message": f"Successfully added label {label_id} to transaction {transaction_id}."}
    
    def remove_label_from_transaction(self, db, transaction_id, label_id):
        db.query(Finance_Transaction_Label).filter_by(transaction_id=transaction_id, label_id=label_id).delete()
        db.commit()
        return {"message": f"Successfully removed label {label_id} from transaction {transaction_id}."}
    
    def add_label_by_keyword(self, db: Session, keyword: str, label_id: int):
        transactions = (
            db.query(Finance_Transaction)
            .filter(
                Finance_Transaction.description.ilike(f"%{keyword}%") |
                Finance_Transaction.recipient.ilike(f"%{keyword}%")
            )
            .all()
        )
        applied_counter = 0
        for transaction in transactions:
            existing_label = db.query(Finance_Transaction_Label).filter_by(
                transaction_id=transaction.id, label_id=label_id
            ).first()

            if not existing_label:
                applied_counter += 1
                db.add(Finance_Transaction_Label(transaction_id=transaction.id, label_id=label_id))
        db.commit()
        return {"message": f"Successfully added label {label_id} to {applied_counter} transactions containing the keyword '{keyword}'. {len(transactions) - applied_counter} transactions already had the label."}
    
    def apply_label_rules_from_file(self, db, rules_file = "keyword_matches.txt"):
        with open(rules_file, "r") as file:
            for line in file:
                keyword, label_name = line.strip().split(";")
                label = self.get_label_by_name(db, label_name)
                if not label:
                    continue
                print(self.add_label_by_keyword(db, keyword, label.id))