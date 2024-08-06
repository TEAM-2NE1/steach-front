import React from 'react';
import ChartRow from './ChartRow';

interface StatisticsChartProps {
  dataset: { statistics: number[] };
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ dataset }) => {
  return (
    <div>
      <ChartRow data={dataset.statistics} />
    </div>
  );
};

export default StatisticsChart;
