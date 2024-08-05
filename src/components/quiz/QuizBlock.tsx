import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './goUp.css';
import QuizChoiceButton from './QuizChoiceButton';  // 새 컴포넌트 import
import { BASE_URL } from "../../api/BASE_URL";

interface QuizData {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
}

const DetailQuiz: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(3); //타이머 관련
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [showMyResult, setShowMyResult] = useState<boolean>(false);

  useEffect(() => {
    //임시로 토큰을 넣어뒀습니다
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJpYXQiOjE3MjI4ODQxMjIsImV4cCI6MTcyMjg5NjEyMiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.rAnd07gJv0kdeTrJOAcQlw1JM_S0gJLPr6UzYGCozLo'; //TODO 토큰 수정

    axios.get<QuizData>(`${BASE_URL}/api/v1/quizzes/995`, {
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
    const emojiTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);

    const questionTimer = setTimeout(() => {
      setShowQuestion(true);
    }, 3000);

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
  
    setIsClicked(true);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="quizContainer" className="relative w-[500px] h-[400px] text-center font-sans flex flex-col justify-start" style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
      <div className="relative h-[200px] flex-1">
        <div style={{ height: '50px' }} />
        <div id='quizEmoji' style={styles.quizEmoji}>
          {isVisible && (
            <div>
              <img
                src="https://item.kakaocdn.net/do/33e4233498cbdb8141bbb5e5b5a7fd59f43ad912ad8dd55b04db6a64cddaf76d"
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
          className={`absolute top-1 left-1 ml-0 opacity-0 text-white text-center transition-opacity duration-500 w-[40px] h-[40px] leading-[40px] rounded-full bg-purple-600 ${
            showChoices ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>{timer}</p>
        </div>

        <div
          id="result"
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-[150px] h-[50px] rounded-lg bg-blue-300 flex items-center justify-center ${
            showMyResult ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>맞았습니다 띄울까?</p>
          {
            showMyResult &&
            setTimeout(() => {
              setShowMyResult(false);
            }, 1000)
          }
        </div>

        <div
          id="question"
          className={`absolute inset-0 top-[50px] text-2xl transition-transform duration-500 ease-in-out flex justify-center items-end pb-2 ${
            showQuestion ? 'opacity-100' : 'opacity-0'
          } ${showChoices ? 'transform translate-y-[-45px]' : 'transform translate-y-0'}`}
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
      <div style={{ height: '50px' }} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  quizEmoji: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
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
    transform: 'translateY(-80px) scale(0.4)'
  },
};

export default DetailQuiz;
