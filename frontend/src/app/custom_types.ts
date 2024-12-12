export type FinanceTransaction = {
    id: number;
    key?: React.ReactNode;
    value: number;
    description: string;
    transaction_date: string;
    tx_type: string;
    import_file: string;
    recipient: string;
    account_number: string;
    import_date: string;
    labels?: FinanceLabel[];
};

export type FinanceLabel = {
    id: number;
    name: string;
    display_name: string;
}

export type FinanceStats = {
    label: FinanceLabel;
    total_value: number;
}

export type FinanceStatsByMonth = {
    month: number;
    monthName: string;
    stats: FinanceStats[];
}