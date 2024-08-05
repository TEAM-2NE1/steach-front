// 학생 회원가입 폼 형식
export interface StudentFormData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  auth_code: string;
}

// 선생님 회원가입 폼 형식
export interface TeacherFormData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  file?: File;
}

// 통합 로그인 폼
export interface LoginForm {
  username: string;
  password: string;
}

// 통합 로그인 반환 폼
export interface LoginReturnForm {
  username: string;
  nickname: string;
  email: string;
  token: string;
  role: string;
}
