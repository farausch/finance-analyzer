"use client";

import React from 'react';
import { Table, TableColumnsType, Tag } from 'antd';
import { FinanceLabel, FinanceTransaction } from '../custom_types';

export type MatchingTableProps = {
  transactions: FinanceTransaction[];
  onSingleRowClick: (record: FinanceTransaction) => void;
};

const columns: TableColumnsType<FinanceTransaction> = [
  {
    title: 'Datum',
    dataIndex: 'transaction_date',
    width: '10%',
    ellipsis: true,
    render: (text: string) => {
      const date = new Date(text);
      return date.toLocaleDateString('de-DE');
    }
  },
  {
    title: 'Zahlungsempfänger',
    dataIndex: 'recipient',
    ellipsis: true,
  },
  {
    title: 'Beschreibung',
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: 'Betrag',
    dataIndex: 'value',
    width: '10%',
    render: (text: number) => {
      return text.toFixed(2) + ' €';
    }
  },
  {
    title: 'Labels',
    dataIndex: 'labels',
    width: '15%',
    ellipsis: true,
    render: (labels: FinanceLabel[]) => {
      return <>
        {labels.map((label) => {
          return <Tag color='purple' key={label.id}>{label.display_name}</Tag>;
        })}
      </>;
    }
  },
];

const TransactionsTable =  ({transactions, onSingleRowClick}: MatchingTableProps) => {

  return (
    <>
      <Table<FinanceTransaction>
        onRow={(record) => {
          return {
            onClick: () => {
              onSingleRowClick(record);
            }
          };
        }}
        columns={columns}
        dataSource={transactions}
        pagination={false} />
    </>
  );
};

export default TransactionsTable;