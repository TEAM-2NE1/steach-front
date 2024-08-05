import React, { useState } from "react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  QuizListData,
  QuizCreateSendForm,
} from "../../../interface/quiz/QuizInterface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { useParams } from "react-router-dom";

// 퀴즈 생성 컴포넌트
const CreateQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lecture_id } = useParams<{ lecture_id: string }>();

  // 메뉴 여닫이 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // tab 상태
  const [tab, setTab] = useState<number>(1);

  // 퀴즈 상태
  const [quiz, setQuiz] = useState<QuizListData[]>([
    {
      quizNumber: 1,
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
      alert("최대4개");
      return;
    } else {
      setQuiz([
        ...quiz,
        {
          quizNumber: counTab,
          choices: ["", "", "", ""],
          question: "",
          answers: 1,
        },
      ]);
    }
  };

  const handleSaveQuizzes = () => {
    // const createQuizData: QuizCreateSendForm = {
    //   lectureId: lecture_id,
    //   quiz_list: quiz,
    // };
    // dispatch();
  };

  // handleChange, handleChoiceChange 아래 두 함수는 받은 값을 qui배열에 저장하는 역할, 특별한 이유 없이 수정x
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
    <div className="grid grid-cols-12 bg-Beige">
      <div className="col-span-3"></div>
      <div className=" flex col-span-6 p-4">
        <div className="hidden lg:flex lg:flex-row lg:justify-between lg:ml-0 my-auto">
          {Array.from({ length: quiz.length }, (_, i) => (
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
        <div className="hidden lg:flex lg:flex-row ml-auto mr-10 my-auto hover:text-lightOrange">
          <button onClick={plusTab} className="flex justify-end">
            퀴즈 추가하기
          </button>
        </div>
        {/* --------------------------------------------------------------- */}
        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="flex flex-grow p-4 lg:hidden">
            <ul className="flex flex-col mx-auto text-lg font-bold mt-4">
              {Array.from({ length: quiz.length }, (_, i) => (
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
              <div className="flex items-center mx-auto hover:text-lightOrange">
                <button onClick={plusTab}>퀴즈 추가하기</button>
              </div>
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
      <div className="col-span-6 ">
        <div className="p-4 flex justify-center">
          {quiz.map((a, i) => {
            return (
              tab === i + 1 && (
                <div key={i} className="w-full">
                  <FormControl>
                    <hr className="border-2 border-hardBeige"></hr>
                    <FormLabel
                      htmlFor="question"
                      className="mt-3 mx-3 text-2xl "
                    >
                      퀴즈 문제를 입력하세요! - question
                    </FormLabel>
                    <Input
                      type="text"
                      id="question"
                      name="question"
                      value={a.question}
                      onChange={(e) =>
                        handleChange(i, "question", e.target.value)
                      }
                      className="border-2 rounded-lg w-full p-2 mt-3"
                      required
                    />
                    <FormLabel
                      htmlFor="choiceSentence"
                      className="mt-3 mx-3 text-2xl "
                    >
                      퀴즈 보기를 입력하세요! - choiceSentence
                    </FormLabel>
                    {a.choices.map((choice: number, choicei: number) => (
                      <div key={choicei}>
                        <label className="mx-2">보기 {choicei + 1}</label>
                        <br></br>
                        <Input
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
                    <FormLabel htmlFor="isAnswer" className="text-2xl">
                      정답
                    </FormLabel>
                    <select
                      id="isAnswer"
                      name="isAnswer"
                      value={a.answer}
                      onChange={(e) =>
                        handleChange(i, "answer", parseInt(e.target.value))
                      }
                      className="border-2 rounded-lg p-2 mb-5"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <br></br>
                    <div className="flex">
                      <Button
                        className="bg-orange-300 w-20 p-2 ml-auto mr-3 rounded-lg hover:bg-orange-400 hover:text-white"
                        onClick={handleSaveQuizzes}
                      >
                        저장
                      </Button>
                    </div>
                  </FormControl>
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default CreateQuiz;
