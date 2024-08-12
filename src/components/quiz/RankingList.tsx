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
  } | null;
}

const RankingsList: React.FC<RankingsProps> = ({ data }) => {
  const [displayedList, setDisplayedList] = useState<Ranking[]>(data ? data.prev : []);
  const [animatedScores, setAnimatedScores] = useState<number[]>(data ? data.prev.map(item => item.score) : []);
  const [animatedRanks, setAnimatedRanks] = useState<number[]>(data ? data.prev.map(item => item.rank) : []);
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
            const targetScore = data? data.current[index].score : 0;
            const difference = targetScore - score;
            let step = Math.ceil(difference / totalSteps); // 각 프레임에서 변화할 양
  
            // step이 너무 작아서 갱신이 안되는 경우를 방지하기 위해 최소값을 설정
            if (Math.abs(step) < 1) {
              step = difference >= 0 ? 1 : -1;
            }

            // 마지막 단계에서 정확하게 목표 점수로 맞추기 위한 조건
            if (Math.abs(difference) < Math.abs(step)) {
              return targetScore; // 마지막 단계에서는 정확하게 목표 점수로 맞춤
            }
  
            return score + step;
          })
        );
      }, intervalTime); // 프레임 간격 50ms
  
      const interval2 = setInterval(() => {
        setAnimatedRanks((prevRank) =>
          prevRank.map((rank, index) => {
            const targetRank = data? data.current[index].rank: 0;
            const difference = targetRank - rank;
            let step = Math.ceil(difference / totalSteps); // 각 프레임에서 변화할 양

            // step이 너무 작아서 갱신이 안되는 경우를 방지하기 위해 최소값을 설정
            if (Math.abs(step) < 1) {
              step = difference >= 0 ? 1 : -1;
            }

            // 마지막 단계에서 정확하게 목표 점수로 맞추기 위한 조건
            if (Math.abs(difference) < Math.abs(step)) {
              return targetRank; // 마지막 단계에서는 정확하게 목표 점수로 맞춤
            }
  
            return rank + step;
          })
        );
      }, intervalTime); // 프레임 간격 50ms
  
      const timeoutId = setTimeout(() => {
        clearInterval(interval);
        clearInterval(interval2);
        setIsTransitioning2(true); // 애니메이션이 종료된 후 상태 업데이트
      }, duration); // 1초 후 애니메이션 종료
  
      return () => {
        clearInterval(interval);
        clearInterval(interval2);
        clearTimeout(timeoutId); // 타이머도 클리어하여 메모리 누수 방지
      };
    }
  }, [isTransitioning, data? data.current: 0]);

  return (
    <div style={{width: '70%'}}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {displayedList.map((item, index) => { //item은 prev
          const currentRank = data? data.current.find(currentItem => currentItem.name === item.name)?.rank: 0;
          const currentScore = data? data.current.find(currentItem => currentItem.name === item.name)?.score: 0;
          const prevRank = item.rank

          return (
            <li
                key={item.name}
                className={`mb-1 py-0 px-5 shadow-md rounded-lg border border-gray-200 ${currentRank === 1 ? 'bg-blue-300' : 'bg-white'}`}
                style={{
                    transition: 'all 0.5s ease',
                    transform: (
                        isTranslationg2 && item.rank !== currentRank && currentRank !== undefined ? 
                          (item.rank - currentRank > 0) ?
                          `translateY(${34 * (currentRank - prevRank)}px)`  :
                          `translateY(${34 * (currentRank - prevRank)}px)`
                        : 'translateY(0)'
                    ),
                    color: 'black',
                }}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="text-lg font-semibold">
                        {isTranslationg2 ? currentRank : Math.round(animatedRanks[index])}. {item.name}
                    </div>
                    <div className="text-sm font-semibold text-black text-right">
                        {isTranslationg2 ? currentScore : Math.round(animatedScores[index])}
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
