import csv
from datetime import datetime
from io import StringIO
from import_config import get_provider_config
from model import Finance_Transaction

class ImportService:

    def __init__(self):
        pass

    async def import_data(self, provider, csv_file, db):
        provider_config = get_provider_config(provider)

        contents = await csv_file.read()
        csv_file = StringIO(contents.decode(provider_config.get_parser_config()['encoding']))
        
        csv_reader = csv.DictReader(csv_file,
                                    delimiter=provider_config.get_parser_config()['delimiter'],
                                    quotechar=provider_config.get_parser_config()['quotechar'],
                                    skipinitialspace=provider_config.get_parser_config()['skipinitialspace'])
        transactions = []
        for row in csv_reader:
            transaction_date_str = row[provider_config.get_mapping()['transaction_date']]
            # AirPlus specific
            transaction_date_str = transaction_date_str.replace('/', '.')
            try:
                transaction_date = datetime.strptime(transaction_date_str, '%d.%m.%y').date()
            except ValueError:
                try:
                    transaction_date = datetime.strptime(transaction_date_str, '%d.%m.%Y').date()
                except ValueError:
                    raise ValueError(f"Invalid date format for transaction_date: {transaction_date_str}")
            # LzO specific
            value = float(row[provider_config.get_mapping()['value']].replace(',', '.'))
            description = row[provider_config.get_mapping()['description']]
            recipient = row[provider_config.get_mapping()['recipient']]
            if 'tx_type' in provider_config.get_mapping():
                    tx_type = row[provider_config.get_mapping()['tx_type']]
            else:
                tx_type = None
            account_number = row[provider_config.get_mapping()['account_number']]
            
            db_finance_transaction = Finance_Transaction(transaction_date=transaction_date,
                                                         value=value,
                                                         description=description,
                                                         recipient=recipient,
                                                         tx_type=tx_type,
                                                         account_number=account_number)
            db.add(db_finance_transaction)
            transactions.append(db_finance_transaction)

        db.commit()
        return {"message": f"Successfully added {len(transactions)} finance transactions."}