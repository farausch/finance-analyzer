from sqlalchemy import Column, Date, Integer, Numeric, String, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Transactions
class Finance_Transaction(Base):
    __tablename__ = "finance_transactions"
    id = Column(Integer, primary_key=True)
    transaction_date = Column(Date)
    value = Column(Numeric)
    description = Column(String)
    recipient = Column(String)
    tx_type = Column(String)
    account_number = Column(String)
    import_file = Column(String)
    import_date = Column(Date, server_default=func.current_date())

    labels = relationship(
        "Finance_Label",
        secondary="finance_transaction_labels",
        back_populates="transactions"
    )

# Labels
class Finance_Label(Base):
    __tablename__ = "finance_labels"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    display_name = Column(String)

    transactions = relationship(
        "Finance_Transaction",
        secondary="finance_transaction_labels",
        back_populates="labels"
    )

# Transaction-Label m:n
class Finance_Transaction_Label(Base):
    __tablename__ = "finance_transaction_labels"
    transaction_id = Column(Integer, ForeignKey("finance_transactions.id"), primary_key=True, index=True)
    label_id = Column(Integer, ForeignKey("finance_labels.id"), primary_key=True)

# Users
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)