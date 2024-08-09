import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  QuizCreateDetailForm,
  QuizCreateSendForm,
} from "../../../interface/quiz/QuizInterface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { useParams } from "react-router-dom";
import { createQuiz } from "../../../store/QuizSlice";

// 퀴즈 생성 컴포넌트
const CreateQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lecture_id } = useParams<{ lecture_id: string }>();

  // 메뉴 여닫이 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // tab 상태
  const [tab, setTab] = useState<number>(1);

  // 퀴즈 상태
  const [quiz, setQuiz] = useState<QuizCreateDetailForm[]>([
    {
      quiz_number: 1,
      question: "",
      choices: ["", "", "", ""],
      answers: 1,
    },
  ]);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 탭 추가 함수
  const plusTab = () => {
    const counTab = quiz.length + 1;
    if (counTab > 4) {
      alert("최대 4개까지 추가할 수 있습니다.");
      return;
    } else {
      setQuiz([
        ...quiz,
        {
          quiz_number: counTab,
          choices: ["", "", "", ""],
          question: "",
          answers: 1,
        },
      ]);
    }
  };

  // 퀴즈 생성 핸들러 함수
  const handleSaveQuizzes = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSaveQuizzes has been triggered");
    const quizData: QuizCreateSendForm = {
      lectureId: lecture_id,
      quiz_list: quiz,
    };

    console.log("Quiz data to be sent:", quizData);

    try {
      const result = await dispatch(createQuiz(quizData));
      console.log("Quiz creation result:", result);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  // handleChange, handleChoiceChange 함수
  const handleChange = (
    index: number,
    name: string,
    value: string | number
  ) => {
    const newQuizzes = [...quiz];
    newQuizzes[index] = { ...newQuizzes[index], [name]: value };
    setQuiz(newQuizzes);
  };

  const handleChoiceChange = (
    quizIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuizzes = [...quiz];
    newQuizzes[quizIndex].choices[choiceIndex] = value;
    setQuiz(newQuizzes);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="bg-white border-4 border-beige-400 rounded-3xl p-6 w-3/5 h-3/4 flex flex-col justify-center overflow-y-auto relative">
        {/* 햄버거 메뉴 버튼 */}
        <div className="lg:hidden absolute top-4 left-4">
          <button onClick={toggleMenu} className="focus:outline-none">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
          </button>
        </div>

        {/* 기본 탭들 (햄버거 메뉴가 닫혀있을 때만 표시) */}
        <div
          className={`${
            isMenuOpen ? "hidden" : "flex"
          } items-center justify-between mb-6`}
        >
          <div className="flex lg:flex-row lg:justify-between lg:ml-0 my-auto">
            {quiz.map((_, i) => (
              <div key={i}>
                <button
                  onClick={() => setTab(i + 1)}
                  className={`text-gray-600 py-4 px-6 mt-3 block rounded-2xl focus:outline-none ${
                    tab === i + 1
                      ? "bg-orange-200 text-white rounded-2xl"
                      : "text-lightNavy hover:text-lightOrange"
                  }`}
                >
                  Quiz {i + 1}
                </button>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex ml-auto mr-0 my-auto">
            <button
              onClick={plusTab}
              className="mt-4 p-3 bg-blue-400 rounded-2xl text-xl text-white hover:bg-blue-600"
            >
              퀴즈 추가
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 (햄버거 아이콘 클릭 시 표시) */}
        {isMenuOpen && (
          <div className="lg:hidden mt-12">
            <div className="flex flex-wrap justify-center space-x-2 space-y-2 text-lg font-bold">
              {quiz.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTab(i + 1)}
                  className={`w-24 text-center py-2 px-4 block rounded-2xl focus:outline-none ${
                    tab === i + 1
                      ? "bg-orange-200 text-white"
                      : "text-lightNavy hover:text-lightOrange"
                  }`}
                >
                  Quiz {i + 1}
                </button>
              ))}
              <button
                onClick={plusTab}
                className="w-24 py-2 px-4 bg-blue-400 rounded-2xl text-center text-white hover:bg-blue-600"
              >
                퀴즈 추가
              </button>
            </div>
          </div>
        )}

        <form className="mt-6" onSubmit={(e) => handleSaveQuizzes(e)}>
          <div className="flex flex-col space-y-8">
            <hr className="border-4 border-hardBeige mb-2 -mt-4"></hr>
            {quiz.map((a, i) => {
              return (
                tab === i + 1 && (
                  <div key={i} className="w-full bg-white rounded-lg">
                    <div>
                      {/* 퀴즈 문제 */}
                      <label
                        htmlFor="question"
                        className="mt-3 mx-3 text-3xl font-bold"
                      >
                        문제를 입력하세요
                      </label>
                      <input
                        type="text"
                        id="question"
                        name="question"
                        value={a.question}
                        onChange={(e) =>
                          handleChange(i, "question", e.target.value)
                        }
                        className="border-2 border-veryLightOrange rounded-lg w-full p-4 mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                        required
                      />

                      <hr className="border-2 border-hardBeige my-10"></hr>

                      {/* 퀴즈 선택지 */}
                      <label
                        htmlFor="choiceSentence"
                        className="mt-3 mx-1 text-3xl font-bold"
                      >
                        선택지를 입력하세요
                      </label>
                      {a.choices.map((choice: string, choicei: number) => (
                        <div key={choicei} className="my-4">
                          <label className="mx-2 text-xl font-semibold">
                            • 보기 {choicei + 1}
                          </label>
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(i, choicei, e.target.value)
                            }
                            className="border-2 border-veryLightOrange rounded-lg w-full p-4 mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                            required
                          />
                        </div>
                      ))}
                      <hr className="border-2 border-hardBeige my-10"></hr>

                      {/* 정답 */}
                      <label htmlFor="answers" className="text-3xl font-bold">
                        정답을 선택하세요
                      </label>
                      <select
                        id="answers"
                        name="answers"
                        value={a.answers}
                        onChange={(e) =>
                          handleChange(i, "answers", parseInt(e.target.value))
                        }
                        className="border-2 border-veryLightOrange rounded-lg p-4 mb-5 w-full mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <br />
                      <div className="flex">
                        <button
                          type="submit"
                          className="bg-orange-300 w-32 p-2 ml-auto mr-3 rounded-lg hover:bg-orange-400 text-white"
                        >
                          퀴즈 생성
                        </button>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
