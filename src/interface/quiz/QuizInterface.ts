// 퀴즈 생성 내부 인터페이스
export interface QuizDetailForm {
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
}

// 퀴즈 생성 리스트 제출 인터페이스
export interface QuizCreateSendForm {
  // 수업 고유 ID
  lectureId: number | undefined;
  quiz_list: QuizDetailForm[];
}

// 퀴즈 생성 리스트 반환 인터페이스
export interface QuizCreateReturnForm {
  quiz_list: QuizDetailForm[];
}

// 퀴즈 상태 인터페이스
export interface QuizState {
  quizzes: QuizDetailForm[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
