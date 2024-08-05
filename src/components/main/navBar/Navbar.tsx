import NavbarLogin from "./NavbarLogin";
import NavbarStudent from "./NavbarStudent";
import NavbarTeacher from "./NavbarTeacher";

// 김헌규 - Navbar 반응형 구현
const Navbar: React.FC = () => {
  const userDataString = localStorage.getItem("auth");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <>
      {!userData && <NavbarLogin />}
      {userData && userData.role === "STUDENT" && (
        <NavbarStudent username={userData.username} />
      )}
      {userData && userData.role === "TEACHER" && (
        <NavbarTeacher username={userData.username} />
      )}
    </>
  );
};

export default Navbar;
