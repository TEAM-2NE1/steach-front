import Footer from "./components/main/Footer.tsx";
import Navbar from "./components/main/Navbar.tsx";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage.tsx";
import SignUpPage from "./pages/user/SignUpPage.tsx";
import ProfilePage from "./pages/student/ProfilePage.tsx";
import HomePage from "./pages/main/HomePage.tsx";
import JosihyeonTest from "./tests/JosihyeonTest.tsx";
import LectureSignUpPage from "./pages/lecture/UpdatePage.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { fetchLectures } from './store/lecturesSlice.tsx';
import { AppDispatch } from "./store";
import TeacherProfilePage from "./pages/teacher/MyRoomPage.tsx";
import MyInfoDetailPage from "./pages/teacher/MyInfoDetailPage.tsx";
import MyInfoDetailUpdate from "./pages/teacher/MyInfoDetailUpdatePage.tsx";
import CurriculumList from "./components/teacher/CurriculumList.tsx";
import ProfileLectureHistory from "./components/teacher/LectureReport.tsx";
import CreateQuiz from "./components/teacher/CreateQuiz.tsx";
import LectureReport from "./components/teacher/LectureReport.tsx";

// 이진송 해당 부분 import 불필요한거 추후에 정리 할 것이니 조금만 참아주세요
//  아래 dispatch는 처음 데이터 로딩을 위해 필요하므로, 지우지 말아주세요
const App: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(fetchLectures());
  // }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/student/profile" element={<ProfilePage />}></Route>
        <Route path="/user/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<SignUpPage />}></Route>
        <Route path="/JosihyeonTest" element={<LectureSignUpPage />}></Route>
        <Route path="/teacher/profile" element={<TeacherProfilePage />}></Route>
        <Route
          path="/teacher/profile/lecture"
          element={<CurriculumList />}
        ></Route>
        <Route
          path="/teacher/profiledetail"
          element={<MyInfoDetailPage />}
        ></Route>
        <Route
          path="/teacher/profiledetail/update"
          element={<MyInfoDetailUpdate />}
        ></Route>
        <Route
          path="/teacher/profile/lecture/createQuiz"
          element={<CreateQuiz />}
        ></Route>
        <Route
          path="/teacher/profile/lecture/lectureReport"
          element={<LectureReport />}
        ></Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
