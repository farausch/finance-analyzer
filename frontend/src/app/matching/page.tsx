"use client";

import { Button, DatePicker, DatePickerProps } from "antd";
import MatchingTable from "../components/MatchingTable";
import { useState } from "react";
import { FinanceTransaction } from "../custom_types";

export default function Matching() {

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([]);
  const [selectedFinanceTransactions, setSelectedFinanceTransactions] = useState<FinanceTransaction[]>([]);

  const selectedMonthChange: DatePickerProps['onChange'] = async (date) => {
    if (date) {
      const firstDay = date.startOf('month').format('DD.MM.YYYY');
      const lastDay = date.endOf('month').format('DD.MM.YYYY');
      const transactionsData = await fetch(`/backend/transactions?start_date=${firstDay}&end_date=${lastDay}`, { cache: 'no-store' });
      const transactions = await transactionsData.json();
      const flatTransactions = transactions.map((tx: FinanceTransaction) => {
        return {
          ...tx,
          ...tx.labels,
          ...tx.categories,
          ...tx.transaction,
        };
      });
      for (let i = 0; i < flatTransactions.length; i++) {
        flatTransactions[i].key = flatTransactions[i].id;
      }
      setFinanceTransactions(flatTransactions);
      console.log(flatTransactions);
    }
  };

  return (
    <>
      <div className="flex flex-row-reverse py-2 px-2">
        <div className="pl-2">
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
        <div>
          <DatePicker onChange={selectedMonthChange} picker="month" format={'MM.YYYY'} />
        </div>
      </div>
      <MatchingTable transactions={financeTransactions} setSelectedFinanceTransactions={setSelectedFinanceTransactions} />
    </>
  )
}