import { Button, Card, Drawer, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { FinanceLabel, FinanceTransaction } from '../custom_types';

interface TransactionDetailsDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    financeTransaction: FinanceTransaction;
    setFinanceTransaction: (financeTransaction: FinanceTransaction) => void;
    triggerTransactionsFetch: () => void;
}

const TransactionDetailsDrawer: React.FC<TransactionDetailsDrawerProps> = ({ open, setOpen, financeTransaction, setFinanceTransaction, triggerTransactionsFetch }) => {

  const [allLabels, setAllLabels] = useState<FinanceLabel[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllLabels();
  }, []);

  const onClose = () => {
    setSelectedLabelId(null);
    setOpen(false);
  };

  const onRemoveLabel = async (labelId: number) => {
    const updateResponse = await fetch(`/backend/transactions/remove-label?transaction_id=${financeTransaction.id}&label_id=${labelId}`, {
      method: 'POST'
    });
    if (!updateResponse.ok) {
      alert('Fehler beim Entfernen des Labels');
    }
    triggerTransactionsFetch();
  }

  const onDropdownChange = (value: number) => {
    setSelectedLabelId(value);
  }

  const onAddLabel = async (labelId: number) => {
    const updateResponse = await fetch(`/backend/transactions/add-label?transaction_id=${financeTransaction.id}&label_id=${labelId}`, {
      method: 'POST'
    });
    if (!updateResponse.ok) {
      alert('Fehler beim Hinzufügen des Labels');
    } else {
      setFinanceTransaction({
        ...financeTransaction,
        labels: [...(financeTransaction.labels || []), allLabels.find(label => label.id === labelId)!]
      });
    }
    triggerTransactionsFetch();
  }

  const fetchAllLabels = async () => {
    const labelsData = await fetch('/backend/labels');
    const labels = await labelsData.json();
    setAllLabels(labels);
  }

  return (
    <Drawer
      title="Transaktionsdetails"
      onClose={onClose}
      open={open}
      width="40vw"
      destroyOnClose={true}
    >
      <div className='flex flex-col space-y-2'>
        <Card title="Datum">
          {new Date(financeTransaction.transaction_date).toLocaleDateString('de-DE')}
        </Card>
        <Card title="Zahlungsempfänger">
          {financeTransaction.recipient}
        </Card>
        <Card title="Beschreibung">
          {financeTransaction.description}
        </Card>
        <Card title="Betrag">
          {financeTransaction.value.toFixed(2)} €
        </Card>
        <Card title="Typ">
          {financeTransaction.tx_type}
        </Card>
        <Card title="Importdatei">
          {financeTransaction.import_file}
        </Card>
        <Card title="Importdatum">
          {new Date(financeTransaction.import_date).toLocaleDateString('de-DE')}
        </Card>
        {financeTransaction.labels &&
        <Card title="Labels">
          <div className='flex justify-between items-center'>
            <div>
              {financeTransaction.labels.map(label => {
                return (
                  <Tag
                    color='purple'
                    key={label.id}
                    closable={true}
                    onClose={onRemoveLabel.bind(null, label.id)}
                  >{label.display_name}</Tag>
                );
              }
              )}
            </div>
            <div className='flex items-center space-x-1'>
              <Select
                showSearch
                placeholder="Label hinzufügen"
                optionFilterProp="label"
                onChange={onDropdownChange}
                options={allLabels.map(label => {
                  return { value: label.id, label: label.display_name }
                })}
              />
              <Button
                type="primary"
                shape="circle"
                size='small'
                disabled={!selectedLabelId}
                onClick={() => selectedLabelId && onAddLabel(selectedLabelId)}
              >
                +
              </Button>
            </div>
          </div>
        </Card>
        }
      </div>
    </Drawer>
  );
};

export default TransactionDetailsDrawer;
