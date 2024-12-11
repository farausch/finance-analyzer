"use client";

import { Button, DatePicker, DatePickerProps } from "antd";
import MatchingTable from "../components/MatchingTable";
import { useState } from "react";
import { FinanceLabel, FinanceTransaction } from "../custom_types";
import { Dayjs } from "dayjs";

export default function FinanceTransactions() {

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [selectedFinanceTransactions, setSelectedFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [allLabels, setAllLabels] = useState<FinanceLabel[]>([]);

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

  const selectedMonthChange: DatePickerProps['onChange'] = async (date) => {
    if (date) {
      getTransactionsForMonth(date);
    }
  };

  const onSingleRowClick = async (record: FinanceTransaction) => {
  }

  const fetchAllLabels = async () => {
    const labelsData = await fetch('/backend/labels');
    const labels = await labelsData.json();
    setAllLabels(labels);
  }

  return (
    <>
      <div className="flex justify-end py-2 px-2 space-x-2">
        <div>
          <DatePicker onChange={selectedMonthChange} picker="month" format={'MM.YYYY'} />
        </div>
      </div>
      <MatchingTable
        transactions={financeTransactions}
        setSelectedFinanceTransactions={setSelectedFinanceTransactions}
        onSingleRowClick={onSingleRowClick}
      />
    </>
  )
}