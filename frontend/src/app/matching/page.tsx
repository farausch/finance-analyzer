import MatchingTable from "../components/MatchingTable";

export default async function Matching() {

  const transactionData = await fetch(`${process.env.BACKEND_URL}/transactions`, { cache: 'no-store' });
  const transactions = await transactionData.json();
  for (let i = 0; i < transactions.length; i++) {
    transactions[i].key = transactions[i].id;
  }
  console.log(transactions);

  return (
    <div>
      <MatchingTable transactions={transactions} />
    </div>
  )
}