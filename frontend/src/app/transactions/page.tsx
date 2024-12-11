"use client";

import { DatePicker, DatePickerProps } from "antd";
import { useState } from "react";
import { FinanceTransaction } from "../custom_types";
import { Dayjs } from "dayjs";
import TransactionDetailsDrawer from "../components/TransactionDetailsDrawer";
import TransactionsTable from "../components/TransactionsTable";

export default function FinanceTransactions() {

  const [currentSelectedMonth, setCurrentSelectedMonth] = useState<Dayjs | null>(null);
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [clickedFinanceTransaction, setClickedFinanceTransaction] = useState<FinanceTransaction | null>(null);
  const [transactionDetailsDrawerOpen, setTransactionDetailsDrawerOpen] = useState(false);

  const getTransactionsForMonth = async (date: Dayjs) => {
    const firstDay = date.startOf('month').format('DD.MM.YYYY');
    const lastDay = date.endOf('month').format('DD.MM.YYYY');
    const transactionsData = await fetch(`/backend/transactions?start_date=${firstDay}&end_date=${lastDay}`, { cache: 'no-store' });
    const transactions = await transactionsData.json();
    transactions.forEach((transaction: FinanceTransaction) => {
      transaction.key = transaction.id;
    });
    setFinanceTransactions(transactions);
  }

  const getTransactionsForCurrentMonth = async () => {
    if (currentSelectedMonth) getTransactionsForMonth(currentSelectedMonth);
  }

  const selectedMonthChange: DatePickerProps['onChange'] = async (date) => {
    setCurrentSelectedMonth(date);
    if (date) {
      getTransactionsForMonth(date);
    }
  };

  const onSingleRowClick = async (record: FinanceTransaction) => {
    setClickedFinanceTransaction(record);
    setTransactionDetailsDrawerOpen(true);
  }

  return (
    <>
      <div className="flex justify-end py-2 px-2 space-x-2">
        <div>
          <DatePicker onChange={selectedMonthChange} picker="month" format={'MM.YYYY'} />
        </div>
      </div>
      <TransactionsTable
        transactions={financeTransactions}
        onSingleRowClick={onSingleRowClick}
      />
      {clickedFinanceTransaction &&
      <TransactionDetailsDrawer
        open={transactionDetailsDrawerOpen}
        setOpen={setTransactionDetailsDrawerOpen}
        financeTransaction={clickedFinanceTransaction}
        setFinanceTransaction={setClickedFinanceTransaction}
        triggerTransactionsFetch={getTransactionsForCurrentMonth}
      />}
    </>
  )
}