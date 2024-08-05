import Footer from "./components/main/Footer.tsx";
import Navbar from "./components/main/navBar/Navbar.tsx";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage.tsx";
import SignUpPage from "./pages/user/SignUpPage.tsx";
import StudentProfilePage from "./pages/student/StudentProfilePage.tsx";
import HomePage from "./pages/main/HomePage.tsx";
import CurriculaDetailPage from "./pages/lecture/DetailPage.tsx";
import LectureUpdatePage from "./pages/lecture/UpdatePage.tsx";
import LectureSignUpPage from "./pages/lecture/SignUpPage.tsx";
import TeacherProfilePage from "./pages/teacher/TeacherMyRoomPage.tsx";
import MyInfoDetailPage from "./pages/teacher/MyInfoDetailPage.tsx";
import MyInfoDetailUpdate from "./pages/teacher/MyInfoDetailUpdatePage.tsx";
import TeacherMyLectureList from "./components/teacher/teacherMyLecture/TeacherMyLectureList.tsx";
import Classroom from "./pages/classroom/classroom.tsx";
// import ProfileLectureHistory from "./components/teacher/LectureReport.tsx";
import CreateQuiz from "./components/teacher/CreateQuiz.tsx";
import LectureReport from "./components/teacher/LectureReport.tsx";

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/student/profile/:username"
          element={<StudentProfilePage />}
        ></Route>
        <Route path="/user/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<SignUpPage />}></Route>
        <Route path="/classroom" element={<Classroom />}></Route>
        <Route
          path="/curricula/detail/:id"
          element={<CurriculaDetailPage />}
        ></Route>
        <Route path="/lecture/signup" element={<LectureSignUpPage />}></Route>
        <Route
          path="/curricula/update/:id"
          element={<LectureUpdatePage />}
        ></Route>
        <Route
          path="/teacher/profile/:username"
          element={<TeacherProfilePage />}
        ></Route>
        <Route
          path="/teacher/profile/:username/curricula/:curricula_id"
          element={<TeacherMyLectureList />}
        ></Route>
        <Route
          path="/teacher/profiledetail/:id"
          element={<MyInfoDetailPage />}
        ></Route>
        <Route
          path="/teacher/profiledetail/update"
          element={<MyInfoDetailUpdate />}
        ></Route>
        <Route
          path="/teacher/profile/:username/curricula/:curricula_id/lecture/:lecture_id/createQuiz"
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
