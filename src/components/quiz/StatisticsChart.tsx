import React, { useState, useEffect } from 'react';
import ChartRow from './ChartRow';
import { Button } from 'antd';
import RankingsList from './RankingList';
import { StatisticRankData } from './QuizBlock';

interface StatisticsChartProps {
  dataset: { statistics: number[] };
  rankData: StatisticRankData | null
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

const data2 = {
  prev: [
    {
      rank: 1,
      score: 300,
      name: "우리마루"
    },
    {
      rank: 2,
      score: 280,
      name: "마루"
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
      score: 1000,
      name: "보기싫은 핑핑"
    },
    {
      rank: 2,
      score: 300,
      name: "우리마루"
    },
    {
      rank: 3,
      score: 280,
      name: "마루"
    },
    {
      rank: 4,
      score: 250,
      name: "귀야운 마루"
    },

  ]
};

const StatisticsChart: React.FC<StatisticsChartProps> = ({ dataset, rankData }) => {
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
          <RankingsList key={Date.now()} data={rankData ? data2 : data2} />
          // <RankingsList key={Date.now()} data={rankData ? rankData : data} //연동 코드 /> 
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
