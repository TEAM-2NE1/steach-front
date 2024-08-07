import { useEffect } from "react";
import NavbarLogin from "./NavbarLogin";
import NavbarStudent from "./NavbarStudent";
import NavbarTeacher from "./NavbarTeacher";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

// 김헌규 - Navbar 반응형 구현
const Navbar: React.FC = () => {
  const userDataString = localStorage.getItem("auth");
  const userData1 = userDataString ? JSON.parse(userDataString) : null;
  const userData = useSelector((state: RootState) => state.auth);

  console.log(userData);
  return (
    <>
      {!userData.username && <NavbarLogin />}
      {userData && userData.role === "STUDENT" && (
        <NavbarStudent nickname={userData1.nickname} />
      )}
      {userData && userData.role === "TEACHER" && (
        <NavbarTeacher nickname={userData1.nickname} />
      )}
    </>
  );
};

export default Navbar;
