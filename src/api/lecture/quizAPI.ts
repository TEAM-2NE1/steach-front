import axios from "axios";
import { BASE_URL } from "../BASE_URL";
import { QuizCreateSendForm } from "../../interface/quiz/QuizInterface";

// 토큰 추출
const userData = localStorage.getItem("auth");
const token = userData ? JSON.parse(userData).token : null;

// 퀴즈 생성
export const createQuizApi = async (quizCreateData: QuizCreateSendForm) => {
  // 강의 아이디
  const lectureId: string = quizCreateData.lectureId;

  // 퀴즈 생성 api 요청 함수
  const response = await axios.post(
    `${BASE_URL}/api/v1/quizzes/${lectureId}`,
    quizCreateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
