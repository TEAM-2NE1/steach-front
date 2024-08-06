import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './goUp.css';
import QuizChoiceButton from './QuizChoiceButton';
import QuizStatistic from './QuizStatistic';
import { BASE_URL } from "../../api/BASE_URL";
import StatisticsChart from '../tmplime/StatisticsChart';
import maruGif from './toktokmaru.gif';

interface QuizData {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
}

interface StatisticData {
  statistics: number[]
}

const DetailQuiz: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [statisticData, setStatisticData] = useState<StatisticData | null>(null);
  
  const [timer, setTimer] = useState<number>(3); //타이머 관련
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [showMyResult, setShowMyResult] = useState<boolean>(false);
  const [showStatistic, setShowStatstic] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // const data: { data: number[] } = 
  // { data: [0, 10, 4, 1] }
  // ;
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxd2VyIiwiaWF0IjoxNzIyOTIyODI1LCJleHAiOjE3MjI5MzQ4MjUsInRva2VuX3R5cGUiOiJhY2Nlc3MifQ.PDVlpFeHAL6LixUQW8ijfqbr6yoEefwAK7QwXaGLYoM'

  useEffect(() => {
    axios.get<QuizData>(`${BASE_URL}/api/v1/quizzes/1290`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setQuizData(response.data);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  }, []);

  useEffect(() => {
    if (showStatistic) {
      axios.get<StatisticData>(`${BASE_URL}/api/v1/quizzes/1290/statistic`, {
        headers: {
          Authorization: `Bearer ${token}`, // 필요한 경우 헤더에 인증 정보 추가
        },
      })
        .then(response => {
          setStatisticData(response.data); // 데이터 설정
        })
        .catch(error => {
          console.error('Error fetching statistic data:', error);
        });
    }
  }, [showStatistic]); // showStatistic이 true가 될 때 요청을 보냄

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

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  
    // 타이머 시작 후 몇 초가 지났는지 계산
    const elapsedSeconds = 3 - timer; // 초기 타이머 값이 3이므로, 현재 타이머 값(timer)으로부터 경과 시간을 계산
    console.log(`타이머가 시작된 후 ${elapsedSeconds}초가 지났습니다.`);

    //statistic axios
    axios.post(`${BASE_URL}/api/v1/studentsQuizzes/1290`, {
      score: 0,
      student_choice: "X"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .catch(error => {
      console.error("There was an error sending the statistics data!", error);
    });
  
    setIsClicked(true);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  // 타이머에 따라 색상 결정
  const clockColor = timer <= 0 ? 'bg-zinc-500' : timer === 1 ? 'bg-red-600' : timer === 2 ? 'bg-amber-400' : timer ===3 ? 'bg-yellow-300' : timer ===4 ? 'bg-lime-400' : 'bg-blue-600';
//파 초 노 주 빨
  return (
    <div id="quizContainer" className="relative w-[500px] h-[400px] text-center font-sans flex flex-col justify-start" style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
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
            showStatistic ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {showStatistic && <StatisticsChart dataset={statisticData ? statisticData : {statistics: [0,1,8,3]}} />}
        </div>


        <div
          id="result"
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-[150px] h-[50px] rounded-lg bg-blue-300 flex items-center justify-center z-50 ${
            (showModal && showMyResult) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>맞았습니다</p>
          {
            showModal &&
            setTimeout(() => {
              setShowModal(false);
              
              
              
              setShowStatstic(true);
            }, 1000)
          }
        </div>

        <div
          id="question"
          className={`absolute inset-0 top-[50px] text-2xl transition-transform duration-500 ease-in-out flex justify-center items-end pb-2 ${
            showQuestion ? 'opacity-100' : 'opacity-0'
          } ${showChoices ? 'transform translate-y-[-45px]' : 'transform translate-y-0'}
          ${showStatistic ? 'transform translate-y-[-140px]' : 'transform translate-y-0'}
          `}
        >
          <p style={{ backgroundColor: '', padding: 10, width: '100%' }}>{quizData.question}</p>
        </div>


      </div>
      <div id='answer' style={{ ...styles.choices, ...(showChoices ? styles.show : styles.hide) }}>
        {quizData.choices.map((choice, index) => {
          const isCorrectChoice = index + 1 === quizData.answers;
          return (
            <QuizChoiceButton
              key={choice}
              choice={choice}
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
