"use client";

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { FinanceStats, FinanceStatsByMonth } from '../custom_types';

interface StatisticsViewProps {
    yearFullStats: FinanceStats[];
    yearByMonthStats: FinanceStatsByMonth[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ yearFullStats, yearByMonthStats }) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const barChartData = yearByMonthStats.reduce((acc, monthStats) => {
    monthStats.stats.forEach(({ label, total_value }) => {
      if (!acc[label.id]) {
        acc[label.id] = {
          x: [],
          y: [],
          name: label.display_name,
          type: 'bar',
        };
      }
      acc[label.id].x.push(monthStats.monthName);
      acc[label.id].y.push(total_value);
    });
    return acc;
  }, {} as Record<number, { x: string[]; y: number[]; name: string; type: string }>);

  const barChartTraces = Object.values(barChartData);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Plot
          data={barChartTraces}
          layout={{
            barmode: 'relative',
            xaxis: {
              title: {
                text: 'Month',
              },
            },
            yaxis: {
              title: {
                text: 'Betrag in EUR',
              },
            },
            width: dimensions.width * 1,
            height: dimensions.height * 1,
          }}
        />
      </div>

      <div style={{ width: '100%' }}>
        <Plot
          data={[
            {
              type: 'treemap',
              labels: yearFullStats.filter((stat) => stat.total_value >= 0).map((stat) => stat.label.display_name),
              parents: yearFullStats.filter((stat) => stat.total_value >= 0).map(() => ''),
              values: yearFullStats.filter((stat) => stat.total_value >= 0).map((stat) => stat.total_value),
              textinfo: 'label+value',
            },
          ]}
          layout={{
            title: 'Jahreseinkommen',
            width: dimensions.width * 1,
            height: dimensions.height * 1,
          }}
        />
      </div>

      <div style={{ width: '100%' }}>
        <Plot
          data={[
            {
              type: 'treemap',
              labels: yearFullStats.filter((stat) => stat.total_value < 0).map((stat) => stat.label.display_name),
              parents: yearFullStats.filter((stat) => stat.total_value < 0).map(() => ''),
              values: yearFullStats.filter((stat) => stat.total_value < 0).map((stat) => Math.abs(stat.total_value)),
              textinfo: 'label+value',
            },
          ]}
          layout={{
            title: 'Jahresausgaben',
            width: dimensions.width * 1,
            height: dimensions.height * 1,
          }}
        />
      </div>
    </div>
  );
};

export default StatisticsView;
