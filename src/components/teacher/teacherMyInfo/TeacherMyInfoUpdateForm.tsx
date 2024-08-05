import { AppDispatch, RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTeacherInfo,
  updateTeacherInfo,
} from "../../../store/userInfo/TeacherProfileSlice";
import { deleteUserSteach, logout } from "../../../store/userInfo/AuthSlice";

export interface TeacherInfoUpdateForm {
  nickname: string;
  email: string;
  password: string;
  brief_introduction: string;
  academic_background: string;
  specialization: string;
  password_auth_token: string | null;
}

const TeacherMyInfoUpdateForm: React.FC = () => {
  const temporaryToken = localStorage.getItem("passwordAuthToken");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const teacherData = useSelector(
    (state: RootState) => state.teacherProfile.info
  );
  useEffect(() => {
    dispatch(fetchTeacherInfo());
  }, [dispatch]);

  // 폼 값 바인딩
  const [formData, setFormData] = useState<TeacherInfoUpdateForm>({
    nickname: teacherData?.nickname || "",
    password: "",
    email: teacherData?.email || "",
    brief_introduction: teacherData?.brief_introduction || "",
    academic_background: teacherData?.academic_background || "",
    specialization: teacherData?.specialization || "",
    password_auth_token: temporaryToken,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 내 정보 수정 요청
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateTeacherInfo(formData));
    localStorage.removeItem("passwordAuthToken");
    navigate("/teacher/profile");
  };

  // 회원 탈퇴 요청
  const handleDelete = async () => {
    // 회원 탈퇴
    await dispatch(deleteUserSteach());
    // 탈퇴 후 로그아웃
    await dispatch(logout());
    // 메인페이지로 이동
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="w-9/12 bg-moreBeige rounded-xl shadow-md p-6 my-12 mx-auto relative">
      <form onSubmit={(e) => handleUpdateSubmit(e)}>
        <h1 className="my-2 p-2 text-center text-4xl text-lightNavy">
          내정보 수정
        </h1>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">닉네임</label>
          <input
            name="nickname"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.nickname}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">비밀번호</label>
          <input
            name="password"
            type="password"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.password}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">이메일</label>
          <input
            name="email"
            type="email"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">
            간단한 소개 문구
          </label>
          <textarea
            name="brief_introduction"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.brief_introduction}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">학력</label>

          <input
            name="academic_background"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.academic_background}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="grid grid-cols-1 my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">전공분야</label>
          <input
            name="specialization"
            className="p-2 w-72 border-2 rounded-md"
            value={formData.specialization}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <button
          onClick={(e) => handleUpdateSubmit(e)}
          className="p-3 bg-red-200 text-white rounded-md shadow-md hover:bg-red-300"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="p-3 bg-red-200 text-white rounded-md shadow-md hover:bg-red-300"
        >
          회원탈퇴
        </button>
      </form>
    </div>
  );
};

export default TeacherMyInfoUpdateForm;
