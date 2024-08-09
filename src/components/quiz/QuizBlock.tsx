import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './goUp.css';
import QuizChoiceButton from './QuizChoiceButton';
import { BASE_URL } from "../../api/BASE_URL";
import StatisticsChart from './StatisticsChart';
import maruGif from './toktokmaru.gif';

interface QuizData {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  time: number;
  question: string;
  choices: string[];
  answers: number;
}

interface StatisticData {
  statistics: number[]
}

export interface RankData {
  rank: number;
  score: number;
  name: string;
}

export interface StatisticRankData {
  prev: RankData[];
  current: RankData[];
}

export interface ApiResponse {
  statistics: number[];
  prev: RankData[];
  current: RankData[];
}

interface DetailQuizProps {
  initialQuizData: QuizData;
  onClose: () => void;
  trialVersion?: boolean;
  trialTimer?: number;
}

const DetailQuiz: React.FC<DetailQuizProps> = ({ initialQuizData, onClose, trialVersion, trialTimer }) => {

  const [showChoices, setShowChoices] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const [statisticData, setStatisticData] = useState<StatisticData | null>(null);
  const [statisticRankData, setStatisticRankData] = useState<StatisticRankData | null>(null);

  const realTime = (trialVersion === undefined || trialVersion === false) ? initialQuizData.time : trialTimer; //타이머관련, 연습판 여부!
  const [timer, setTimer] = useState<number>(realTime !== undefined ? realTime : initialQuizData.time); // 타이머 시간

  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [showMyResult, setShowMyResult] = useState<boolean>(false);
  const [showStatistic, setShowStatstic] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJpYXQiOjE3MjMxMDUzMzksImV4cCI6MTcyOTEwNTMzOSwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.uyMfUDDiF46n296z2x4908K7U8Tmd6PYpmmnJJfdmZc';
  useEffect(() => {
    if (showStatistic) {
      axios.get<ApiResponse>(`${BASE_URL}/api/v1/quizzes/${initialQuizData?.quiz_id}/statistic`, {
        headers: {
          Authorization: `Bearer ${token}`, // 필요한 경우 헤더에 인증 정보 추가
        },
      })
        .then(response => {
          console.log(response.data)
          setStatisticData({statistics: response.data.statistics}); // 데이터 설정
          setStatisticRankData({prev: response.data.prev, current: response.data.current})
        })
        .catch(error => {
          console.error('Error fetching statistic data:', error);
        });
    }
  }, [showStatistic, initialQuizData]); // showStatistic이 true가 될 때 요청을 보냄

  useEffect(() => {
    const emojiTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);

    const questionTimer = setTimeout(() => {
      setShowQuestion(true);
    }, 2500);

    const choicesTimer = setTimeout(() => {
      setIsVisible(false);
      setShowChoices(true);
      

      const countdownTimer = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(countdownTimer);
            setShowAnswer(true);
            setIsClicked(true);
            setShowMyResult(true);
            setShowModal(true);
            return 0;
          }
        });
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(questionTimer);
      clearTimeout(choicesTimer);
      clearTimeout(emojiTimer);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      const timeoutId = setTimeout(() => {
        setShowModal(false);
        setShowStatstic(true);
      }, 1000);

      // 타이머 정리
      return () => clearTimeout(timeoutId);
    }
  }, [showModal]);

  const handleChoiceClick = (choice: number) => {
    setSelectedChoice(choice);
    
    //선택지 문자열
    const choiceSentence = initialQuizData.choices[choice];
  
    // 타이머 시작 후 몇 초가 지났는지 계산
    // const elapsedSeconds = initialQuizData.time - timer; // 초기 타이머 값이 3이므로, 현재 타이머 값(timer)으로부터 경과 시간을 계산

    const score = (timer * 100) / initialQuizData.time;
    console.log("점수는 " + score + "점!")

    //statistic axios
    if (trialVersion) {
      //pass
    } else {
      axios.post(`${BASE_URL}/api/v1/studentsQuizzes/1290`, {
        score: score,
        student_choice: "choiceSentence"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .catch(error => {
        console.error("There was an error sending the statistics data!", error);
      });
    }
  
    setIsClicked(true);
  };

  if (!initialQuizData) {
    return <div>Loading...</div>;
  }

  // 타이머에 따라 색상 결정
  //: timer ===4 ? 'bg-lime-400'
  const clockColor = timer <= 0 ? 'bg-zinc-500' : timer === 1 ? 'bg-red-600' : timer === 2 ? 'bg-amber-400' : timer ===3 ? 'bg-yellow-300'  : 'bg-blue-600';
//파 초 노 주 빨
  return (
    <div id="quizContainer" className="relative w-[500px] h-[400px] text-center font-sans flex flex-col justify-start" style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
      {/* <span className="close-button" onClick={onClose}>&times;</span>   빼도됨 */}
      <div className="relative h-[200px] flex-1">
        <div style={{ height: '50px' }} />
        <div id='quizEmoji' style={styles.quizEmoji}>
          {isVisible && (
            <div>
              <img
                src={maruGif}
                alt="Animated GIF"
                title='퀴즈가 시작됩니다!'
                style={{
                  ...styles.emoji,
                  ...(startAnimation ? styles.animate : {})
                }}
              />
            </div>
          )}
        </div>

        <div
          id="clock"
          className={`absolute top-[5%] right-1 ml-0 opacity-0 text-white text-center transition-opacity duration-500 w-[40px] h-[40px] leading-[40px] rounded-full ${clockColor} ${
            (showChoices && !showStatistic) ? 'opacity-100' : 'opacity-0'
          }`}
          style={{}}
        >
          <p>{timer}</p>
        </div>

        <div 
          id="statistic"
          className={`absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-full h-[50px] flex items-center justify-center ${
            showStatistic ? 'opacity-70' : 'opacity-0'
          }`}
        >
          {showStatistic && (
            <div className="w-full">
              <StatisticsChart dataset={statisticData ? {statistics: [0, 1, 8, 3]} : {statistics: [0, 1, 8, 3]}} rankData = {statisticRankData} />
              {/* <StatisticsChart dataset={statisticData ? statisticData : {statistics: [0, 1, 8, 3]}} rankData = {statisticRankData} /> //연동코드 */}
            </div>
          )}
        </div>

        <div
          id="result"
          className={`absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-[150px] h-[50px] rounded-lg flex items-center justify-center z-50 ${
            (showModal && showMyResult && !showStatistic) ? 'opacity-100' : 'opacity-0'
          } ${(selectedChoice === initialQuizData.answers - 1) ? 'bg-blue-300' : 'bg-red-300'}`}
        >
          <p>{(selectedChoice === initialQuizData.answers - 1) ? '맞았습니다' : '틀렸습니다'}</p>
        </div>

        <div
          id="question"
          className={`absolute inset-0 top-[50px] text-2xl transition-transform duration-500 ease-in-out flex justify-center items-end pb-2 ${
            showQuestion ? 'opacity-100' : 'opacity-0'
          } transform ${
            showStatistic ? 'translate-y-[-145px]' : showChoices ? 'translate-y-[-45px]' : 'translate-y-0'
          }`}
        >
          <p style={{ backgroundColor: '', padding: 10, width: '100%' }}>{initialQuizData.question}</p>
        </div>

      </div>
      <div id='answer' style={{ ...styles.choices, ...(showChoices ? styles.show : styles.hide) }}>
        {initialQuizData.choices.map((choice, index) => {
          const isCorrectChoice = (index + 1 === initialQuizData.answers);

          return (
            <QuizChoiceButton
              key={index}
              choiceSentence={choice}
              isCorrectChoice={isCorrectChoice}
              isClicked={isClicked}
              selectedChoice={selectedChoice}
              showAnswer={showAnswer}
              onClick={handleChoiceClick}
              index={index} // 1부터 시작하도록 전달
            />
          );
        })}
      </div>
      <div style={{ height: '10px' }} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  quizEmoji: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shrink: {
    transform: 'translateY(-45px)',
  },
  choices: {
    marginTop: 'auto',
    opacity: 0,
    transition: 'opacity 0.5s ease-in-out',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  },
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
  emoji: {
    width: '300px',
    height: '300px',
    transition: 'transform 2s ease-in-out, opacity 2s ease-in-out, font-size 2s ease-in-out',
    transform: 'translateY(0)',
  },
  animate: {
    transform: 'scale(0.2)',
    opacity: 0,  // 추가된 부분: 애니메이션 시 투명해짐
    transition: 'transform 1.5s ease-in-out, opacity 1s ease-in-out',  // 투명도에 대한 트랜지션 추가
  },
  
};

export default DetailQuiz;
