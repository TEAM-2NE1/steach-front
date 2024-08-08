import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../api/BASE_URL.ts";
import DetailQuiz from './QuizBlock.tsx';

export interface QuizResponseDTO {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
  time: number;
}

interface QuizListComponentProps {
  trialVersion?: boolean;
  trialTimer?: number;
}

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJpYXQiOjE3MjMxMDUzMzksImV4cCI6MTcyOTEwNTMzOSwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.uyMfUDDiF46n296z2x4908K7U8Tmd6PYpmmnJJfdmZc';

const QuizListComponent: React.FC<QuizListComponentProps> = ({trialVersion, trialTimer}) => {
  const [quizzes, setQuizzes] = useState<QuizResponseDTO[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/quizzes/lecture/5365`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          },
        });

        if (response.data && response.data.quiz_response_dtos && response.data.quiz_response_dtos.length > 0) {
          setQuizzes(response.data.quiz_response_dtos);
        } 
      } catch (error) {
        setError('Failed to fetch quiz data');
      }
    };

    fetchQuizData();
  }, []);

  const handleButtonClick = (quiz: QuizResponseDTO) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (quizzes.length === 0) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      {quizzes.map((quiz) => (
        <button
          key={quiz.quiz_id}
          onClick={() => handleButtonClick(quiz)}
          className="w-full text-left bg-blue-200 text-white p-2 mb-2 rounded hover:bg-blue-600 transition"
        >
          Quiz {quiz.quiz_number} - {quiz.question}
        </button>
      ))}

      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] relative">
            {/* Close Button Overlapping DetailQuiz */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition text-2xl z-10"
            >
              &times;
            </button>
            
            {/* DetailQuiz Component Centered */}
            <div className="flex justify-center items-center">
              <div className="rounded-lg overflow-hidden w-full">
                <DetailQuiz initialQuizData={selectedQuiz} onClose={handleCloseModal} 
                  trialVersion={trialVersion}
                  {...(true ? { trialTimer: trialTimer } : {})} // trialTimer is included only when trialVersion is true
              />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizListComponent;
