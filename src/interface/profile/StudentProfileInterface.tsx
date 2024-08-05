import { Curricula } from "../Curriculainterface";

// 학생 정보 형식
export interface StudentInfo {
  username: string;
  nickname: string;
  email: string;
}

// 학생의 기본 정보 형식
export interface StudentUserInfo {
  status: string;
  error: string | null;
  info: StudentInfo | null;
  curricula: Curricula[];
}
