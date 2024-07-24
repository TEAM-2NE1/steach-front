import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";


// 퀴즈 생성 컴포넌트
const CreateQuiz: React.FC = () => {

  interface QuizData {
    // 수업 고유 ID
    lectureId: number;
    // 퀴즈 번호
    quizNumber: number;
    // 퀴즈 문제 내용
    question: string;
    // 퀴즈 정답 여부
    isAnswer: number;
    // 퀴즈 선택지 문항(리스트)
    choiceSentence: string[];
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tab, setTab] = useState<number>(1);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [qui, setQui] = useState<QuizData[]>([
    {
      lectureId: 0, // params로 받을?듯?
      quizNumber: 1,
      question: "",
      isAnswer: 1,
      choiceSentence: ['', '', '', ''],
    }
  ]);

  const plusTab = () => {
    const counTab = qui.length + 1;
    if (counTab > 4) {
      alert("최대4개"); return;
    }
    else {
      setQui([
        ...qui,
        {
          lectureId: 0, // params로 받을?듯?
          quizNumber: counTab,
          question: "",
          isAnswer: 1,
          choiceSentence: ['', '', '', ''],
        }
      ])
    }
  }
  
  const handleSaveQuizzes = () => {
    // axios 추가해야함
    console.log(qui);
  };
  
  const handleChange = (index: number, name: string, value: string | number) => {
    const newQuizzes = [...qui];
    newQuizzes[index] = { ...newQuizzes[index], [name]: value };
    setQui(newQuizzes);
  };

  const handleChoiceChange = (quizIndex: number, choiceIndex: number, value: string) => {
    const newQuizzes = [...qui];
    newQuizzes[quizIndex].choiceSentence[choiceIndex] = value;
    setQui(newQuizzes);
  };


  return (
    <div className="grid grid-cols-12 bg-Beige">
      <div className="col-span-3"></div>

      <div className=" flex col-span-6">
        <div className="hidden lg:flex lg:flex-row lg:justify-between p-4 lg:ml-0">
          {
            Array.from({ length: qui.length }, (a, i) => (
              <div key={i}>
                <button
            onClick={() => setTab(i + 1)}
            className={`text-gray-600 py-4 px-6 mt-3 block rounded-2xl focus:outline-none ${
              tab === i + 1
              ? "bg-orange-200 text-white rounded-2xl"
              : "text-lightNavy hover:text-lightOrange"
              }`}
              >
            Quiz {i+1}
          </button>
            </div>
            ))
          }
        </div>
          <div className='hidden ml-auto mr-10 my-auto hover:text-lightOrange'>
          <button onClick={plusTab} className="flex justify-end">
            퀴즈 추가하기
          </button>
            </div>
        {/* --------------------- */}
        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="flex flex-grow p-4 lg:hidden">
            <ul className="flex flex-col mx-auto text-lg font-bold mt-4">
            {
              Array.from({ length: qui.length }, (a, i) => (
                <div key={i} className="w-full flex flex-col lg:hidden">
                    <li className="p-2">
                  <button
                    onClick={() => setTab(i + 1)}
                    className={`hover:text-orange-300 ${tab === i + 1
                      ? ""
                      : "text-lightNavy hover:text-lightOrange"
                    }`}
                    >
                    Quiz {i + 1}
                  </button>
                    </li>
                </div>
              ))
            }
            <div className='flex items-center mx-auto hover:text-lightOrange lg:hidden'>
              <button onClick={plusTab}>
                퀴즈 추가하기
              </button>
            </div>
            </ul>
          </div>
        )}
        {/* 햄버거 */}
        <div className="absolute right-40 lg:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
        </button>
      </div>
        {/* --------------------- */}
      </div>
      <div className="col-span-3"></div>
      <div className="col-span-3"></div>
      <div className="col-span-6 ">
        <div className="p-4 flex justify-center">
          {
            qui.map((a, i) => {
              return (
                tab === i + 1 &&
                <div
                    key={i}
                    className="w-full"
                  >
        <FormControl>
            <hr className="border-2 border-hardBeige"></hr>
          <FormLabel htmlFor="question" className="mt-3 mx-3 text-2xl ">
            문제 - question
          </FormLabel>
          <Input
            type="text"
            id="question"
            name="question"
            value={a.question}
            onChange={(e) => handleChange(i, 'question', e.target.value)}
            className="border-2 rounded-lg w-full p-2 mt-3"
            required
          />
          <FormLabel htmlFor="choiceSentence" className="mt-3 mx-3 text-2xl ">
            답 - choiceSentence
          </FormLabel>
            {a.choiceSentence.map((choice, choicei) => (
            <div key={choicei}>
              <label className="mx-2">보기 {choicei + 1}</label>
              <br></br>
              <Input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(i, choicei, e.target.value)}
                className="border-2 rounded-lg p-2 mt-3"
                required
              />
            </div>
          ))}
            <FormLabel htmlFor="isAnswer" className="text-2xl">정답</FormLabel>
            <select
            id='isAnswer'
            name='isAnswer'
            value={a.isAnswer}
            onChange={(e) => handleChange(i, 'isAnswer', parseInt(e.target.value))}
            className="border-2 rounded-lg p-2 mb-5"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
                      </select>
                      <br></br>
          <Button
              className="bg-orange-300 w-20 p-2 mt-3 rounded-lg hover:bg-orange-400 hover:text-white"
              onClick={handleSaveQuizzes}
          >버튼임</Button>
        </FormControl>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default CreateQuiz;
