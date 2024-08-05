import React, { useState, useEffect } from "react";
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
    <div className="grid grid-cols-12 bg-Beige">
      <div className="col-span-3"></div>
      <div className=" flex col-span-6 p-4 relative">
        <button
          className="p-3 absolute top-8 right-10 rounded-md bg-sky-200 text-white hover:bg-sky-300"
          onClick={handleUpdateQuiz}
        >
          수정하기
        </button>
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

        {/* --------------------------------------------------------------- */}
        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="flex flex-grow p-4 lg:hidden">
            <ul className="flex flex-col mx-auto text-lg font-bold mt-4">
              {quiz.map((_, i) => (
                <div key={i} className="w-full flex flex-col">
                  <li className="p-2">
                    <button
                      onClick={() => setTab(i + 1)}
                      className={`hover:text-orange-300 ${
                        tab === i + 1
                          ? ""
                          : "text-lightNavy hover:text-lightOrange"
                      }`}
                    >
                      Quiz {i + 1}
                    </button>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        )}
        {/* 햄버거 */}
        <div className="ml-auto mt-5 lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
          </button>
        </div>
        {/* --------------------------------------------------------------- */}
      </div>
      <div className="col-span-3"></div>
      <div className="col-span-3"></div>
      <form className="col-span-6 ">
        <div className="p-4 flex justify-center">
          {quiz.map((quizItem, i) => {
            return (
              tab === i + 1 && (
                <div key={i} className="w-full">
                  <div>
                    <hr className="border-2 border-hardBeige"></hr>
                    {/* 퀴즈 문제 */}
                    <label htmlFor="question" className="mt-3 mx-3 text-2xl ">
                      퀴즈 문제
                    </label>
                    <input
                      type="text"
                      id="question"
                      name="question"
                      value={quizItem.question}
                      onChange={(e) =>
                        handleChange(i, "question", e.target.value)
                      }
                      className="border-2 rounded-lg w-full p-2 mt-3"
                      required
                    />

                    {/* 퀴즈 보기 */}
                    <label
                      htmlFor="choiceSentence"
                      className="mt-3 mx-3 text-2xl "
                    >
                      퀴즈 보기
                    </label>
                    {quizItem.choices.map((choice, choicei) => (
                      <div key={choicei}>
                        <label className="mx-2">보기 {choicei + 1}</label>
                        <br></br>
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) =>
                            handleChoiceChange(i, choicei, e.target.value)
                          }
                          className="border-2 rounded-lg p-2 mt-3"
                          required
                        />
                      </div>
                    ))}
                    <label htmlFor="answers" className="text-2xl">
                      정답
                    </label>
                    <select
                      id="answers"
                      name="answers"
                      value={quizItem.answers}
                      onChange={(e) =>
                        handleChange(i, "answers", parseInt(e.target.value))
                      }
                      className="border-2 rounded-lg p-2 mb-5"
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
      <div className="col-span-3"></div>
    </div>
  );
};

export default PatchQuiz;
