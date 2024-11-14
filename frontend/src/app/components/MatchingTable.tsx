"use client";

import React from 'react';
import { Table } from 'antd';
import { FinanceTransaction } from '../custom_types';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';

export type MatchingTableProps = {
  transactions: FinanceTransaction[];
};

const columns: ColumnsType<FinanceTransaction> = [
  {
    title: 'Transaktionsdatum',
    dataIndex: 'transaction_date',
    render: (text: string) => {
      const date = new Date(text);
      return date.toLocaleDateString('de-DE');
    }
  },
  {
    title: 'Zahlungsempfänger',
    dataIndex: 'recipient',
  },
  {
    title: 'Beschreibung',
    dataIndex: 'description',
  },
  {
    title: 'Betrag',
    dataIndex: 'value',
    render: (text: number) => {
      return text.toFixed(2) + ' €';
    }
  },
  {
    title: 'Typ',
    dataIndex: 'tx_type',
  },
  {
    title: 'Importdatei',
    dataIndex: 'import_file',
  },
  {
    title: 'Importdatum',
    dataIndex: 'import_date',
    render: (text: string) => {
      const date = new Date(text);
      return date.toLocaleDateString('de-DE');
    }
  }
];

const rowSelection: TableRowSelection<FinanceTransaction> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const MatchingTable =  ({transactions}: MatchingTableProps) => {
  return (
    <Table<FinanceTransaction>
      rowSelection={rowSelection}
      columns={columns}
      dataSource={transactions}
      pagination={false} />
  );
};

export default MatchingTable;