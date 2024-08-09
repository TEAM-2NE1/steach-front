import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { deleteQuiz } from "../../../store/QuizSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import NoQuiz from "./NoQuiz";

// 퀴즈 조회 컴포넌트
const FetchQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // username, curricula_id, lecture_id 추출
  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();

  // store에서 quizzes 상태 가져오기
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);

  // 메뉴 여닫이 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // tab 상태
  const [tab, setTab] = useState<number>(1);

  // 현재 퀴즈 id 상태
  const [quizId, setQuizId] = useState<number | null>(null);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 탭이 변경될 때마다 해당 퀴즈의 ID를 설정
  useEffect(() => {
    if (quizzes && quizzes[tab - 1]) {
      setQuizId(quizzes[tab - 1].quiz_id);
    }
  }, [tab, quizzes]);

  // 삭제 핸들러 함수
  const handleDeleteQuiz = async () => {
    // 삭제 요청
    if (quizId !== null) {
      await dispatch(deleteQuiz(quizId));
      window.location.reload();
    } else {
      console.log("quizId가 설정되지 않았습니다.");
    }
  };

  return (
    <>
      {!quizzes?.length && <NoQuiz />}
      {quizzes?.length && (
        <div className="flex justify-center min-h-screen bg-gray-100 pt-10 pb-10">
          <div className="bg-white border-4 border-beige-400 rounded-3xl p-6 w-3/5 h-3/4 flex flex-col justify-center overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="hidden lg:flex lg:flex-row lg:justify-between lg:ml-0 my-auto">
                {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setTab(i + 1)}
                      className={`w-24 text-gray-600 py-4 px-6 mt-3 block rounded-2xl focus:outline-none ${
                        tab === i + 1
                          ? "bg-orange-200 text-white"
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
                  className="mt-3 p-3 h-14 bg-blue-400 rounded-2xl text-xl text-white hover:bg-blue-600"
                  onClick={() =>
                    navigate(
                      `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/updateQuiz`
                    )
                  }
                >
                  수정하기
                </button>

                <button
                  className="mt-3 p-3 bg-red-400 rounded-2xl text-xl text-white hover:bg-red-600"
                  onClick={handleDeleteQuiz}
                >
                  삭제하기
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* 모바일 메뉴 */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={isMenuOpen ? faTimes : faBars}
                  size="2x"
                />
              </button>
              {isMenuOpen && (
                <div className="mt-4 flex flex-col">
                  <ul className="flex flex-col space-y-4 text-lg font-bold">
                    {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
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
                      onClick={() =>
                        navigate(
                          `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/updateQuiz`
                        )
                      }
                    >
                      수정하기
                    </button>
                    <button
                      className="w-24 py-2 px-4 bg-red-400 rounded-2xl text-center text-white hover:bg-red-600"
                      onClick={handleDeleteQuiz}
                    >
                      삭제하기
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* --------------------------------------------------------------- */}

            <form className="mt-6">
              <div className="flex flex-col space-y-8">
                <hr className="border-4 border-hardBeige mb-2 -mt-4"></hr>
                {quizzes?.map((quiz, i) => {
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
                          <p className="bg-veryLightOrange p-4 rounded-lg mt-4 text-xl">
                            {quiz.question}
                          </p>
                          <hr className="border-2 border-hardBeige my-10"></hr>

                          {/* 퀴즈 선택지 */}
                          <label
                            htmlFor="choiceSentence"
                            className="mt-3 mx-1 text-3xl font-bold"
                          >
                            선택지
                          </label>
                          {quiz.choices.map(
                            (choice: string, choicei: number) => (
                              <div key={choicei} className="mt-4">
                                <label className="mx-2 text-xl font-semibold">
                                  • 보기 {choicei + 1}
                                </label>
                                <p className="bg-veryLightOrange p-4 rounded-lg mt-2 text-lg">
                                  {choice}
                                </p>
                              </div>
                            )
                          )}
                          <hr className="border-2 border-hardBeige my-10"></hr>

                          {/* 정답 */}
                          <label
                            htmlFor="isAnswer"
                            className="text-3xl font-bold"
                          >
                            정답
                          </label>
                          <p className="bg-veryLightOrange p-4 rounded-lg mt-4 text-xl my-10">
                            {quiz.answers}
                          </p>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FetchQuiz;
