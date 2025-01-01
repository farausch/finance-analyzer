import StatisticsView from "../../components/StatisticsView";

export default async function FinanceStatistics({ params }) {
  const { year } = params; // Extract the year from the URL params
  const selectedYear = parseInt(year, 10) || new Date().getFullYear(); // Fallback to current year if invalid

  const yearStatsByMonth = [];
  for (let i = 0; i < 12; i++) {
    const firstDay = new Date(selectedYear, i, 1).toLocaleDateString('de-DE');
    const lastDay = new Date(selectedYear, i + 1, 0).toLocaleDateString('de-DE');

    const statsJson = await fetch(
      `${process.env.BACKEND_URL}/transactions/grouped-by-label?start_date=${firstDay}&end_date=${lastDay}`,
      { cache: 'no-store' }
    );
    const stats = await statsJson.json();
    yearStatsByMonth.push({
      month: i + 1,
      monthName: new Date(selectedYear, i, 1).toLocaleDateString('de-DE', { month: 'long' }),
      stats,
    });
  }

  const firstDayOfYear = new Date(selectedYear, 0, 1).toLocaleDateString('de-DE');
  const lastDayOfYear = new Date(selectedYear, 11, 31).toLocaleDateString('de-DE');

  const yearStatsJson = await fetch(
    `${process.env.BACKEND_URL}/transactions/grouped-by-label?start_date=${firstDayOfYear}&end_date=${lastDayOfYear}`,
    { cache: 'no-store' }
  );
  const yearStats = await yearStatsJson.json();

  return (
    <>
      <StatisticsView yearFullStats={yearStats} yearByMonthStats={yearStatsByMonth} />
    </>
  );
}

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const recentYears = [
    { year: currentYear.toString() },
    { year: (currentYear - 1).toString() }
  ];
  return recentYears;
}
