import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { deleteQuiz } from "../../../store/QuizSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

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
  const handleDeleteQuiz = () => {
    // 삭제 요청
    if (quizId !== null) {
      dispatch(deleteQuiz(quizId));
      window.location.reload();
    } else {
      console.log("quizId가 설정되지 않았습니다.");
    }
  };

  return (
    <div className="grid grid-cols-12 bg-Beige">
      <div className="col-span-3"></div>
      <div className=" flex col-span-6 p-4 relative">
        <button
          className="p-3 absolute top-8 right-36"
          onClick={() =>
            navigate(
              `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/updateQuiz`
            )
          }
        >
          수정하기
        </button>
        <button
          className="p-3 absolute top-8 right-10 bg-red-200 rounded-md text-white hover:bg-red-300"
          onClick={handleDeleteQuiz}
        >
          삭제하기
        </button>
        <div className="hidden lg:flex lg:flex-row lg:justify-between lg:ml-0 my-auto">
          {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
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
              {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
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
          {quizzes?.map((quiz, i) => {
            return (
              tab === i + 1 && (
                <div key={i} className="w-full">
                  <div>
                    <hr className="border-2 border-hardBeige"></hr>
                    {/* 퀴즈 문제 */}
                    <label htmlFor="question" className="mt-3 mx-3 text-2xl ">
                      퀴즈 문제
                    </label>
                    <p>{quiz.question}</p>

                    {/* 퀴즈 보기 */}
                    <label
                      htmlFor="choiceSentence"
                      className="mt-3 mx-3 text-2xl "
                    >
                      퀴즈 보기
                    </label>
                    {quiz.choices.map((choice: string, choicei: number) => (
                      <div key={choicei}>
                        <label className="mx-2">보기 {choicei + 1}</label>
                        <br></br>
                        <p>{choice}</p>
                      </div>
                    ))}
                    <label htmlFor="isAnswer" className="text-2xl">
                      정답
                    </label>
                    <p>{quiz.answers}</p>
                    <br></br>
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

export default FetchQuiz;
