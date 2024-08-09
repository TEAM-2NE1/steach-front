import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  QuizDetailForm,
  QuizUpdateSendForm,
} from "../../../interface/quiz/QuizInterface";
import { useParams, useNavigate } from "react-router-dom";
import { updateQuiz } from "../../../store/QuizSlice";

const PatchQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();

  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tab, setTab] = useState<number>(1);

  // quizzes 배열을 quiz 상태로 설정
  const [quiz, setQuiz] = useState<QuizDetailForm[]>(quizzes || []);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // input 입력 값 바인딩
  const handleChange = (
    index: number,
    name: string,
    value: string | number
  ) => {
    const newQuizzes = [...quiz];
    newQuizzes[index] = { ...newQuizzes[index], [name]: value };
    setQuiz(newQuizzes);
  };

  // React에서는 얕은 복사로 하면 안되고 깊은 복사로 상태를 업데이트 해야함.
  const handleChoiceChange = (
    quizIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuizzes = quiz.map((q, idx) =>
      idx === quizIndex
        ? {
            ...q,
            choices: q.choices.map((choice, cIdx) =>
              cIdx === choiceIndex ? value : choice
            ),
          }
        : q
    );
    setQuiz(newQuizzes);
  };

  const handleUpdateQuiz = async () => {
    const updateData: QuizUpdateSendForm = {
      lectureId: lecture_id,
      quiz_list: quiz,
    };
    await dispatch(updateQuiz(updateData));
    navigate(
      `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/quiz`
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="bg-white border-4 border-beige-400 rounded-3xl p-6 w-3/5 h-3/4 flex flex-col justify-center overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="hidden lg:flex lg:flex-row lg:justify-between lg:ml-0 my-auto">
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
          <div className="hidden lg:flex space-x-4">
            <button
              className="mt-4 p-3 bg-blue-400 rounded-2xl text-xl text-white hover:bg-blue-600"
              onClick={handleUpdateQuiz}
            >
              수정하기
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* 모바일 메뉴 */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
          </button>
          {isMenuOpen && (
            <div className="mt-4 flex flex-col">
              <ul className="flex flex-col space-y-4 text-lg font-bold">
                {quiz.map((_, i) => (
                  <li key={i} className="flex justify-center">
                    <button
                      onClick={() => {
                        setTab(i + 1);
                        setIsMenuOpen(false);
                      }}
                      className={`w-24 text-center py-2 px-4 block rounded-2xl focus:outline-none ${
                        tab === i + 1
                          ? "bg-orange-200 text-white"
                          : "text-lightNavy hover:text-lightOrange"
                      }`}
                    >
                      Quiz {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-evenly mt-4">
                <button
                  className="w-24 py-2 px-4 bg-blue-400 rounded-2xl text-center text-white hover:bg-blue-600"
                  onClick={handleUpdateQuiz}
                >
                  수정하기
                </button>
              </div>
            </div>
          )}
        </div>
        {/* --------------------------------------------------------------- */}

        <form className="mt-6">
          <div className="flex flex-col space-y-8">
            <hr className="border-4 border-hardBeige mb-2 -mt-4"></hr>
            {quiz.map((quizItem, i) => {
              return (
                tab === i + 1 && (
                  <div key={i} className="w-full bg-white rounded-lg">
                    <div>
                      {/* 퀴즈 문제 */}
                      <label
                        htmlFor="question"
                        className="mt-3 mx-3 text-3xl font-bold"
                      >
                        문제
                      </label>
                      <input
                        type="text"
                        id="question"
                        name="question"
                        value={quizItem.question}
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
                        선택지
                      </label>
                      {quizItem.choices.map((choice, choicei) => (
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
                        정답
                      </label>
                      <select
                        id="answers"
                        name="answers"
                        value={quizItem.answers}
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

export default PatchQuiz;
