import csv
from io import StringIO
from mapping_config import LZO_MAPPING
from model import Finance_Transaction

class ImportService:

    def __init__(self):
        pass

    async def import_data(self, csv_file, db):
        contents = await csv_file.read()
        csv_file = StringIO(contents.decode('utf-8'))
        #csv_file = StringIO(contents.decode('ISO-8859-1'))
        
        # Parse the CSV file
        csv_reader = csv.DictReader(csv_file, delimiter=';', quotechar='"', skipinitialspace=True)
        transactions = []
        for row in csv_reader:
            transaction_date = row[LZO_MAPPING['transaction_date']]
            value = float(row[LZO_MAPPING['value']].replace(",", "."))
            description = row[LZO_MAPPING['description']]
            recipient = row[LZO_MAPPING['recipient']]
            
            db_finance_transaction = Finance_Transaction(transaction_date=transaction_date, value=value, description=description, recipient=recipient)
            db.add(db_finance_transaction)
            transactions.append(db_finance_transaction)

        db.commit()
        return {"message": f"Successfully added {len(transactions)} finance transactions."}