export type FinanceTransaction = {
    key?: React.ReactNode;
    value: number;
    description: string;
    transaction_date: string;
    tx_type: string;
    import_file: string;
    id: number;
    recipient: string;
    account_number: string;
    import_date: string;
};