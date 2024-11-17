"use client";

import React from 'react';
import { Table, TableColumnsType, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { FinanceLabel, FinanceTransaction } from '../custom_types';

export type MatchingTableProps = {
  transactions: FinanceTransaction[];
  setSelectedFinanceTransactions: React.Dispatch<React.SetStateAction<FinanceTransaction[]>>;
  onSingleRowClick: (record: FinanceTransaction) => void;
};

const columns: TableColumnsType<FinanceTransaction> = [
  {
    title: 'Datum',
    dataIndex: 'transaction_date',
    width: '7%',
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
    width: '7%',
    render: (text: number) => {
      return text.toFixed(2) + ' €';
    }
  },
  {
    title: 'Typ',
    dataIndex: 'tx_type',
    width: '10%',
    ellipsis: true,
  },
  {
    title: 'Labels',
    dataIndex: 'labels',
    width: '10%',
    ellipsis: true,
    render: (labels: FinanceLabel[]) => {
      return <>
        {labels.map((label) => {
          return <Tag color='purple' key={label.id}>{label.display_name}</Tag>;
        })}
      </>;
    }
  },
  {
    title: 'Importdatei',
    dataIndex: 'import_file',
    width: '10%',
    ellipsis: true,
  },
  {
    title: 'Importdatum',
    dataIndex: 'import_date',
    width: '7%',
    render: (text: string) => {
      const date = new Date(text);
      return date.toLocaleDateString('de-DE');
    }
  }
];

const MatchingTable =  ({transactions, setSelectedFinanceTransactions, onSingleRowClick}: MatchingTableProps) => {

  const rowSelection: TableRowSelection<FinanceTransaction> = {
    onSelect: (record, selected, selectedRows) => {
      setSelectedFinanceTransactions(selectedRows);
    },
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedFinanceTransactions(selectedRows);
    }
  };

  return (
    <>
      <Table<FinanceTransaction>
        rowSelection={rowSelection}
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

export default MatchingTable;