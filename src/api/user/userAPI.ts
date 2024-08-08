import axios from "axios";
import { TeacherInfo } from "../../interface/profile/TeacherProfileInterface";
import { StudentInfo } from "../../interface/profile/StudentProfileInterface";
import { TeacherInfoUpdateForm } from "../../components/teacher/teacherMyInfo/TeacherMyInfoUpdateForm";
import { StudentInfoUpdateForm } from "../../components/student/studentMyInfo/StudentMyInfoUpdateForm";
import {
  LoginForm,
  LoginReturnForm,
  StudentSignUpForm,
  TeacherSignUpForm,
} from "../../interface/auth/AuthInterface";
import { BASE_URL } from "../BASE_URL";

const tokenData = localStorage.getItem("auth");
const jsontokenData = tokenData ? JSON.parse(tokenData) : null;
const token = jsontokenData ? jsontokenData.token : "";

// 학생 회원가입
export const signUpStudentApi = async (formDataToSend: StudentSignUpForm) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/student/join`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 선생님 회원가입
export const signUpTeacherApi = async (formData: TeacherSignUpForm) => {
  try {
    const data = new FormData();
    // file이 있는 경우에만 추가
    if (formData.file) {
      data.append("file", formData.file);
    }
    data.append("teacherSignUpDto", JSON.stringify(formData));

    const response = await axios.post(`${BASE_URL}/api/v1/teacher/join`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 아이디 중복 확인
export const checkUsernameDuplicateApi = (username: string) => {
  const response = axios.get(`${BASE_URL}/api/v1/check-username/${username}`);
  return response;
};

// 닉네임 중복 확인
export const checkNicknameDuplicateApi = (nickname: string) => {
  const response = axios.get(
    `${BASE_URL}/api/v1/student/check-nickname/${nickname}`
  );

  return response;
};

// 학생 이메일 중복 확인
export const checkStudentEmailDuplicateApi = (email: string) => {
  const response = axios.get(`${BASE_URL}/api/v1/student/check-email/${email}`);

  return response;
};

// 선생님 이메일 중복 확인
export const checkTeacherEmailDuplicateApi = (email: string) => {
  const response = axios.get(`${BASE_URL}/api/v1/teacher/check-email/${email}`);

  return response;
};

// 내정보 수정 비밀번호 체크
export const passwordCheck = async (password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/check/password`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 로그인
export const login = async (formDataToSend: LoginForm) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/login`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: LoginReturnForm = {
      username: response.data.username,
      nickname: response.data.nickname,
      email: response.data.email,
      token: response.data.token,
      role: response.data.role,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 선생님 정보 조회
export const teacherInfoGet = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/teachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: TeacherInfo = {
      username: response.data.username,
      nickname: response.data.nickname,
      email: response.data.email,
      volunteer_time: response.data.volunteer_time,
      brief_introduction: response.data.brief_introduction,
      academic_background: response.data.academic_background,
      specialization: response.data.specialization,
    };

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 선생님 정보 수정
export const teacherInfoUpdate = async (formData: TeacherInfoUpdateForm) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/v1/teachers`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 학생 정보 조회
export const studentInfoGet = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: StudentInfo = {
      username: response.data.username,
      nickname: response.data.nickname,
      email: response.data.email,
    };

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 학생 정보 수정
export const studentInfoUpdate = async (formData: StudentInfoUpdateForm) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/v1/students`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 회원 탈퇴
export const deleteMember = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
