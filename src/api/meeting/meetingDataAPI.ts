import axios from "axios";
import { BASE_URL } from "../BASE_URL";

// Post student focus time
export const postStudentFocusTime = async (
  lectureId: number,
  focusTimeData: { focus_time: number }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/studentsLectures/focus-time/${lectureId}`,
      focusTimeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post student quiz result
export const postStudentQuizResult = async (
  quizId: number,
  quizResultData: {
    score: number;
    student_choice: string;
    student_name: string;
  }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/studentsQuizzes/${quizId}`,
      quizResultData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
