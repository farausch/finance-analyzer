from abc import ABC, abstractmethod
from enum import Enum

class Provider(Enum):
    LZO = "LZO"
    AIRPLUS = "AIRPLUS"

class ProviderConfig(ABC):
    @abstractmethod
    def get_mapping(self):
        pass

    @abstractmethod
    def get_parser_config(self):
        pass

class LZOConfig(ProviderConfig):
    def get_mapping(self):
        return {
            'value': 'Betrag',
            'transaction_date': 'Buchungstag',
            'description': 'Verwendungszweck',
            'recipient': 'Beguenstigter/Zahlungspflichtiger',
            'tx_type': 'Buchungstext',
            'account_number': 'Auftragskonto',
        }

    def get_parser_config(self):
        return {
            'delimiter': ';',
            'quotechar': '"',
            'skipinitialspace': True,
            'encoding': 'ISO-8859-1'
        }

class AirplusConfig(ProviderConfig):
    def get_mapping(self):
        return {
            'value': 'Abgerechneter Betrag',
            'transaction_date': 'Umsatzdatum',
            'description': 'Transaktionsart',
            'recipient': 'Händlername',
            'account_number': 'Kartennummer',
        }

    def get_parser_config(self):
        return {
            'delimiter': ';',
            'quotechar': '"',
            'skipinitialspace': True,
            'encoding': 'UTF-8'
        }
    
    # Problems
    # , as thousands separator
    # -1 multiplier
    # Umlaute incorrectly encoded
    # Date contains /

    # Idea: add a preprocessor to the config for each provider
    # Remove LzO specific preprocessing from import_service.py ()

def get_provider_config(provider: Provider) -> ProviderConfig:
    if provider == Provider.LZO:
        return LZOConfig()
    elif provider == Provider.AIRPLUS:
        return AirplusConfig()
    else:
        raise ValueError("Unsupported provider")
