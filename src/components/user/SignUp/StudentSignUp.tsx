import { useState } from "react";
import student from "../../../assets/student.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpStudent, loginSteach } from "../../../store/userInfo/AuthSlice";
import { AppDispatch, RootState } from "../../../store";
import SpinnerComponent from "../../main/spinner/Spinner";

// 이진송
const StudentSignUp: React.FC = () => {
  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  // useNavigate
  const navigate = useNavigate();

  // 회원 인증 상태 및 에러
  const { status } = useSelector((state: RootState) => state.auth);

  // FormData 타입 포함해서 만듦
  interface FormData {
    username: string;
    password: string;
    nickname: string;
    email: string;
    auth_code: string;
  }

  interface loginInfoData {
    username: string;
    password: string;
  }

  // 데이터를 담기 위한 박스 개념, 함수를 위의 interface에 맞춰서 작성
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    nickname: "",
    email: "",
    auth_code: "",
  });

  // 비밀번호 확인 검증
  const [confirmPassword, setComfirmPassword] = useState("");

  //사용자가 값을 입력할 때 마다, onChange로 데이터가 입력됨.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 비밀번호 확인 양방향 바인딩
  const handleComfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setComfirmPassword(event.target.value);
  };

  // 제출을 했을때 나타나는 이벤트
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 만약 8자이상 16자이하라면 axios요청 보내기
    if (formData.password.length >= 8 && formData.password.length <= 16) {
      requestSignUp();
      // 아니면 경고 alert
    } else {
      toast.warn("비밀번호를 다시 입력해주세요.", {
        position: "top-center",
      });
    }
  };

  // 회원가입 요청 함수
  const requestSignUp = async () => {
    // form의 id값 따라서 받은 값을 넣어줌
    const formDataToSend: FormData = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email,
      auth_code: formData.auth_code,
    };

    const resultSignUpAction = await dispatch(signUpStudent(formDataToSend));

    const loginInfo: loginInfoData = {
      username: resultSignUpAction.meta.arg.username,
      password: resultSignUpAction.meta.arg.password,
    };

    if (signUpStudent.fulfilled.match(resultSignUpAction)) {
      toast.success("회원가입에 성공하였습니다.", {
        position: "top-center",
      });

      // 회원가입과 동시에 로그인하러 가야함.
      const resultLoginAction = await dispatch(loginSteach(loginInfo));
      if (loginSteach.fulfilled.match(resultLoginAction)) {
        toast.success("로그인에 성공하였습니다.", {
          position: "top-center",
        });
      }

      navigate("/");
      window.location.reload();
    } else {
      if (resultSignUpAction.payload) {
        toast.error(
          `회원가입에 실패하였습니다: ${resultSignUpAction.payload}`,
          {
            position: "top-center",
          }
        );
      } else {
        toast.error("회원가입에 실패하였습니다.", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <>
      <div>
        <img src={student} />
      </div>
      {status === "loading" ? (
        <SpinnerComponent />
      ) : (
        <form
          className="max-w-md mx-auto border-2 rounded-xl p-6 mb-28"
          onSubmit={handleSubmit}
        >
          <section>
            <label htmlFor="username" className="text-2xl">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mb-5"
              required
            />
          </section>
          <section>
            <label htmlFor="password" className="text-2xl">
              비밀번호
            </label>
            <div className="mb-5">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 "
                required
              />
              {
                <p className="mt-2 text-sm">
                  비밀번호는 8 ~ 16자리여야 합니다.
                </p>
              }
            </div>
          </section>
          <section>
            <label htmlFor="confirmPassword" className="text-2xl">
              비밀번호확인
            </label>
            <div className="mb-5">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleComfirmPassword}
                className="border-2 rounded-lg w-full p-2"
                required
              />
              {formData.password.length >= 8 &&
                confirmPassword.length >= 8 &&
                (formData.password === confirmPassword ? (
                  <p className="mt-2 text-sm text-red-500">
                    비밀번호가 일치합니다.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                ))}
            </div>
          </section>
          <section>
            <label htmlFor="email" className="text-2xl">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mb-5"
              required
            />
          </section>
          <section>
            <label htmlFor="email" className="text-2xl">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mb-5"
              required
            />
          </section>
          <section>
            <label htmlFor="auth_code" className="text-2xl">
              인증코드
            </label>
            <input
              type="text"
              id="auth_code"
              name="auth_code"
              value={formData.auth_code}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mb-5"
              required
            />
          </section>
          <button
            type="submit"
            className="w-full text-center bg-orange-300 p-2 rounded-lg hover:bg-orange-400 hover:text-white"
          >
            회원가입
          </button>
        </form>
      )}
    </>
  );
};

export default StudentSignUp;
