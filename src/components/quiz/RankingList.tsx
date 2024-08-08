import React, { useState, useEffect } from 'react';

interface Ranking {
  rank: number;
  score: number;
  name: string;
}

interface RankingsProps {
  data: {
    prev: Ranking[];
    current: Ranking[];
  };
}

const RankingsList: React.FC<RankingsProps> = ({ data }) => {
  const [displayedList, setDisplayedList] = useState<Ranking[]>(data.prev);
  const [animatedScores, setAnimatedScores] = useState<number[]>(data.prev.map(item => item.score));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTranslationg2, setIsTransitioning2] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTransitioning(true); // 전환 시작
    }, 50); // 딜레이 조정 가능

    return () => clearTimeout(timeout); // 타임아웃 정리
  }, [data]);

  useEffect(() => {
    if (isTransitioning) {
      const duration = 500; // 총 애니메이션 시간 1초
      const intervalTime = 50; // 프레임 간격 50ms
      const totalSteps = duration / intervalTime; // 총 프레임 수

      const interval = setInterval(() => {
        setAnimatedScores((prevScores) =>
          prevScores.map((score, index) => {
            const targetScore = data.current[index].score;
            const difference = targetScore - score;
            const step = difference / totalSteps; // 각 프레임에서 변화할 양

            if (Math.abs(difference) < Math.abs(step)) {
              return targetScore; // 마지막 단계에서는 정확하게 목표 점수로 맞춤
            }

            return score + step;
          })
        );
      }, intervalTime); // 프레임 간격 50ms

      setTimeout(() => {
        clearInterval(interval)
        setIsTransitioning2(true)
      }, duration); // 1초 후 애니메이션 종료

      return () => clearInterval(interval); // 인터벌 정리
    }
  }, [isTransitioning, data.current]);

  return (
    <div style={{width: '70%'}}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {displayedList.map((item, index) => {
          const prevRank = data.current.find(currentItem => currentItem.name === item.name)?.rank;
          const currentRank = item.rank

          return (
            <li
                key={item.name}
                className={`mb-1 py-0 px-5 shadow-md rounded-lg border border-gray-200 ${currentRank === 1 ? 'bg-blue-300' : 'bg-white'}`}
                style={{
                    transition: 'all 0.5s ease',
                    transform: (
                        isTranslationg2 && item.rank !== prevRank && prevRank !== undefined ? 
                        (item.rank - prevRank > 0) ?
                        `translateY(${35 * (item.rank - prevRank)}px)`  :
                        `translateY(${35 * (item.rank - prevRank)}px)`
                        : 'translateY(0)'
                    ),
                    color: 'black',
                }}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="text-lg font-semibold">
                        {item.rank}. {item.name}
                    </div>
                    <div className="text-sm font-semibold text-black text-right">
                        {Math.round(animatedScores[index])}
                    </div>
                </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RankingsList;
