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
}

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJpYXQiOjE3MjI5MjYyNDQsImV4cCI6MTcyMjkzODI0NCwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.10GG-ui0sHrV6-bbd_yfE7dd8eSAq7QvN9OMhj_p8-I';

const QuizListComponent: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizResponseDTO[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/quizzes/lecture/2240`, {
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
    return <div>{error}</div>;
  }

  if (quizzes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <style>
        {`
          .modal {
            display: block;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
          }

          .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
          }

          .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close-button:hover,
          .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
        `}
      </style>

      {quizzes.map((quiz) => (
        <button key={quiz.quiz_id} onClick={() => handleButtonClick(quiz)}>
          Quiz {quiz.quiz_number} - {quiz.question}
        </button>
      ))}

      {isModalOpen && selectedQuiz && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <DetailQuiz initialQuizData={selectedQuiz} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizListComponent;
