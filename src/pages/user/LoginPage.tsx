import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSteach } from "../../store/userInfo/AuthSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import LoginBannerBgImg from "../../assets/banner.jpg";

// 이진송
// 디자인 변경 필요함
const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 로그인 폼 형식
  interface FormData {
    username: string;
    password: string;
  }

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  // 양방향 바인딩을 위한 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginFormData: FormData = {
      username: formData.username,
      password: formData.password,
    };

    await dispatch(loginSteach(loginFormData));
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="main-content relative h-screen background-image bg-cover bg-center bg-no-repeat">
        <img
          src={LoginBannerBgImg}
          className="absolute opacity-60 z-0 w-full"
        />
        <div className="flex items-center justify-center h-full ">
          <form
            className="relative max-w-md mx-auto p-6 bg-white shadow-md rounded-lg z-10"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="username" className="text-2xl">
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-2 rounded-lg p-2 mb-4"
                required
              />
              <label htmlFor="password" className="text-2xl">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 rounded-lg p-2w-full border-2 rounded-lg p-2"
                required
              />
              {/* 해당부분 로그인 버튼 확인하고 수정해야겠음 - 이진송이 할거임 */}
              <button
                type="submit"
                className="w-full text-center bg-orange-300 p-2 mt-4 mb-2 rounded-lg hover:bg-orange-400 hover:text-white"
              >
                로그인
              </button>
              <button
                type="submit"
                className="w-full text-center bg-orange-300 p-2 mt-2 rounded-lg hover:bg-orange-400 hover:text-white"
                onClick={() => {
                  navigate("/user/signup");
                }}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
