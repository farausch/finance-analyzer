from model import Finance_Label, Finance_Transaction_Label

class LabelService:

    def __init__(self):
        pass

    def get_labels(self, db):
        labels = db.query(Finance_Label).all()
        return labels

    def create_label(self, db, name, display_name):
        db.add(Finance_Label(name=name, display_name=display_name))
        db.commit()
        return {"message": f"Successfully created label {name}."}

    def add_label_to_transaction(self, db, transaction_id, label_id):
        db.add(Finance_Transaction_Label(transaction_id=transaction_id, label_id=label_id))
        db.commit()
        return {"message": f"Successfully added label {label_id} to transaction {transaction_id}."}