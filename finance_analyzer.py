import sqlite3
import pandas as pd
import os
import matplotlib.pyplot as plt
import plotly.express as px

DATA_DIR = "data/annotated/"
DB_NAME = "finance.db"
LZO_MAPPING = {"Betrag": "value", "Buchungstag": "transaction_date"}
LZO_ENCODING = "ISO-8859-1"

def get_dataframe(directory, mapping, encoding):
    csv_files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    df = pd.concat((pd.read_csv(directory + file, encoding=encoding, sep=";", index_col=None) for file in csv_files))
    df.rename(columns=mapping, inplace=True)
    df['transaction_date']= pd.to_datetime(df['transaction_date'], format='%d.%m.%y')
    df['value'] = df['value'].str.replace(",", ".")
    return df

def import_data(df, db_name):
    db_conn = sqlite3.connect(db_name)
    cursor = db_conn.cursor()
    df.to_sql("finance", db_conn, if_exists="replace")
    return cursor

def get_income_sum(cursor):
    return cursor.execute("SELECT SUM(value) FROM finance WHERE transaction_date > date('2022-07-01') AND value > 0").fetchone()[0]

def get_all_categories(cursor):
    for row in cursor.execute("SELECT DISTINCT category FROM finance ORDER BY category"):
        print(row)

def get_data_monthly(cursor, year):
    for month in range(1, 13):
        start = f"{year}-0{month}-01" if month < 10 else f"{year}-{month}-01"
        end = f"{year}-0{month + 1}-01" if month < 9 else f"{year}-{month + 1}-01"
        print("================================================================")
        print(f"{start} - {end}")
        params = (start, end)
        for row in cursor.execute("SELECT category, SUM(value) FROM finance WHERE transaction_date > date(?) AND transaction_date < date(?) GROUP BY category ORDER BY SUM(value) DESC", params):
            print(row)

def get_data_complete(cursor):
    data = []
    for row in cursor.execute("SELECT category, SUM(value), strftime('%m', transaction_date) as month, strftime('%Y', transaction_date) as year FROM finance GROUP BY category, month, year ORDER BY year ASC, month ASC"):
        #print(row)
        data.append(row)
    return data

def plot_data_complete(data):
    df = pd.DataFrame(data, columns=["category", "value", "month", "year"])
    df["month_year"] = df["month"] + "-" + df["year"]
    df.drop(columns=["month"], inplace=True)
    df.drop(columns=["year"], inplace=True)
    fig = px.line(df, x="month_year", y="value", color="category", markers=True, title="Finance Analysis")
    fig.for_each_trace(lambda trace: trace.update(visible="legendonly"))
    fig.show()

df = get_dataframe(DATA_DIR, LZO_MAPPING, LZO_ENCODING)
cursor = import_data(df, DB_NAME)
get_data_monthly(cursor, 2022)
get_all_categories(cursor)
plot_data_complete(get_data_complete(cursor))