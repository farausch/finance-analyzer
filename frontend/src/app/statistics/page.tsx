import StatisticsView from "../components/StatisticsView";

export default async function FinanceStatistics() {
  const yearStatsByMonth = [];
  for (let i = 0; i < 12; i++) {
    const firstDay = new Date(new Date().getFullYear(), i, 1).toLocaleDateString('de-DE');
    const lastDay = new Date(new Date().getFullYear(), i + 1, 0).toLocaleDateString('de-DE');
    const statsJson = await fetch(`${process.env.BACKEND_URL}/transactions/grouped-by-label?start_date=${firstDay}&end_date=${lastDay}`, { cache: 'no-store' });
    const stats = await statsJson.json();
    yearStatsByMonth.push({ month: i + 1, monthName: new Date(new Date().getFullYear(), i, 1).toLocaleDateString('de-DE', { month: 'long' }), stats });
  }
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('de-DE');
  const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('de-DE');
  const yearStatsJson = await fetch(`${process.env.BACKEND_URL}/transactions/grouped-by-label?start_date=${firstDayOfYear}&end_date=${lastDayOfYear}`, { cache: 'no-store' });
  const yearStats = await yearStatsJson.json();
  console.log(yearStatsByMonth);

  return (
    <>
      <StatisticsView yearFullStats={yearStats} yearByMonthStats={yearStatsByMonth} />
    </>
  )
}