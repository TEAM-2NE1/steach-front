import axios from "axios";
import { TeacherInfo } from "../../interface/profile/TeacherProfileInterface";
import { StudentInfo } from "../../interface/profile/StudentProfileInterface";
import { TeacherInfoUpdateForm } from "../../components/teacher/teacherMyInfo/TeacherMyInfoUpdateForm";
import { StudentInfoUpdateForm } from "../../components/student/studentMyInfo/StudentMyInfoUpdateForm";
import {
  LoginForm,
  LoginReturnForm,
  StudentFormData,
  TeacherFormData,
} from "../../interface/auth/AuthInterface";
import { BASE_URL } from "../BASE_URL";

const tokenData = localStorage.getItem("auth");
const jsontokenData = tokenData ? JSON.parse(tokenData) : null;
const token = jsontokenData ? jsontokenData.token : "";

// 학생 회원가입
export const signUpStudentApi = async (formDataToSend: StudentFormData) => {
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
export const signUpTeacherApi = async (formData: TeacherFormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/teacher/join`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 비밀번호 체크
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
