"use client";

import { Button, DatePicker, DatePickerProps } from "antd";
import MatchingTable from "../components/MatchingTable";
import { useState } from "react";
import { FinanceLabel, FinanceTransaction } from "../custom_types";
import { Dayjs } from "dayjs";
import LabelModificationDrawer from "../components/LabelModificationDrawer";

export default function Matching() {

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [selectedFinanceTransactions, setSelectedFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [singleClickedFinanceTransactionId, setSingleClickedFinanceTransactionId] = useState<number | null>(null);
  const [labelModificationDrawerOpen, setLabelModificationDrawerOpen] = useState<boolean>(false);
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
    if (allLabels.length === 0) {
      await fetchAllLabels();
    }
    setSingleClickedFinanceTransactionId(record.id);
    setLabelModificationDrawerOpen(true);
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
        <div>
          <Button
            type="primary"
            disabled={selectedFinanceTransactions.length === 0}
            onClick={() => {
              alert(selectedFinanceTransactions.map((tx) => tx.id).join(', '));
            }}
          >
          Label zuordnen
          </Button>
        </div>
      </div>
      <MatchingTable
        transactions={financeTransactions}
        setSelectedFinanceTransactions={setSelectedFinanceTransactions}
        onSingleRowClick={onSingleRowClick}
      />
      {singleClickedFinanceTransactionId && (
        <LabelModificationDrawer
          open={labelModificationDrawerOpen}
          setOpen={setLabelModificationDrawerOpen}
          transactions={financeTransactions}
          setTransactions={setFinanceTransactions}
          selectedTransactionId={singleClickedFinanceTransactionId}
          allLabels={allLabels}
        />
      )}
    </>
  )
}