import { Drawer, Tag } from "antd";
import { FinanceLabel, FinanceTransaction } from "../custom_types";
import { useEffect, useState } from "react";

interface LabelModificationDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactions: FinanceTransaction[];
  setTransactions: (transactions: FinanceTransaction[]) => void;
  selectedTransactionId: number | null;
  allLabels: FinanceLabel[];
}

const LabelModificationDrawer: React.FC<LabelModificationDrawerProps> = ({open, setOpen, transactions, setTransactions, selectedTransactionId, allLabels}) => {

  const [allLabelsFiltered, setAllLabelsFiltered] = useState<FinanceLabel[]>([]);

  useEffect(() => {
    setAllLabelsFiltered(allLabels.filter((label) => {
      return !transactions.find((tx) => tx.id === selectedTransactionId)?.labels?.some((l) => l.id === label.id);
    }));
  }, [transactions, allLabels, selectedTransactionId]);

  const onClose = () => {
    setOpen(false);
  }

  const deactivateLabel = (label: FinanceLabel) => {
    setTransactions(transactions.map((tx) => {
      if (tx.id === selectedTransactionId) {
        tx.labels = tx.labels?.filter((l) => l.id !== label.id);
      }
      return tx;
    }
    ));
  }

  const activateLabel = async (label: FinanceLabel) => {
    const updateResponse = await fetch(`/backend/transactions/add-label?transaction_id=${selectedTransactionId}&label_id=${label.id}`, {
      method: 'POST'
    });
    if (!updateResponse.ok) {
      alert('Fehler beim Hinzufügen des Labels');
      return;
    }
    setTransactions(transactions.map((tx) => {
      if (tx.id === selectedTransactionId) {
        tx.labels = [...(tx.labels || []), label];
      }
      return tx;
    }
    ));
  }

  return (
    <>
      <Drawer
        title="Label verwalten"
        placement={'right'}
        width={500}
        onClose={onClose}
        destroyOnClose={true}
        open={open}
      >
        <div className="flex flex-col">
          <span>Aktive Labels</span>
          <div className="flex">
            {transactions.find((tx) => tx.id === selectedTransactionId)?.labels?.map((label) => {
              return (
                <Tag
                  className="cursor-pointer"
                  color='purple'
                  key={label.id}
                  onClick={() => deactivateLabel(label)}
                >{label.display_name}</Tag>
              );
            })}
          </div>
          <span>Inaktive Labels</span>
          <div className="flex flex-wrap gap-y-2">
            {allLabelsFiltered.map((label) => {
              return (
                <Tag
                  className="cursor-pointer"
                  key={label.id}
                  onClick={() => activateLabel(label)}
                >{label.display_name}</Tag>
              );
            })}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default LabelModificationDrawer;