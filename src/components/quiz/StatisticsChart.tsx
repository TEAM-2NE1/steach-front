import React, { useState, useEffect } from 'react';
import ChartRow from './ChartRow';
import { Button } from 'antd';
import RankingsList from './RankingList';

interface StatisticsChartProps {
  dataset: { statistics: number[] };
}

const data = {
  prev: [
    {
      rank: 2,
      score: 280,
      name: "마루"
    },
    {
      rank: 1,
      score: 300,
      name: "우리마루"
    },
    {
      rank: 3,
      score: 100,
      name: "귀야운 마루"
    },
    {
      rank: 4,
      score: 0,
      name: "보기싫은 핑핑"
    }
  ],
  current: [
    {
      rank: 1,
      score: 300,
      name: "마루"
    },
    {
      rank: 2,
      score: 300,
      name: "우리마루"
    },
    {
      rank: 3,
      score: 250,
      name: "귀야운 마루"
    },
    {
      rank: 4,
      score: 1,
      name: "보기싫은 핑핑"
    }
  ]
};

const StatisticsChart: React.FC<StatisticsChartProps> = ({ dataset }) => {
  const [showRankings, setShowRankings] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // 2초 후에 showRankings를 true로 설정
    const timer = setTimeout(() => {
      setShowRankings(true);
    }, 2000);

    // 타이머를 정리하여 메모리 누수를 방지
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setShowRankings(true);
  };

  const handleButtonClick2 = () => {
    setShowRankings(false);
    setShowNext(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showRankings && (
        <Button style={{ width: 30, margin: 2 }} onClick={handleButtonClick2}>
          {"<"}
        </Button>
      )}
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        {!showRankings ? (
          <ChartRow data={dataset.statistics} />
        ) : (
          <RankingsList key={Date.now()} data={data} />
        )}
      </div>
      {showNext && !showRankings && (
        <Button style={{ width: 30, margin: 2 }} onClick={handleButtonClick}>
          {">"}
        </Button>
      )}
    </div>
  );
};

export default StatisticsChart;
