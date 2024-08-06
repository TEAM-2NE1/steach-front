import { useState } from "react";
import { useDispatch } from "react-redux";
import logoImage from "../../../assets/LOGO.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { logout } from "../../../store/userInfo/AuthSlice";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";
import { useLocation } from "react-router-dom";
import { searchCurricula } from "../../../store/SearchSlice";

// Props 타입 정의
interface Props {
  username: string;
}

const NavbarTeacher: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // 선생님 아이디 추출
  const Data = localStorage.getItem("auth");
  const teacherData = Data ? JSON.parse(Data) : "";

  // 현재 경로 추출
  const currentPath = location.pathname;

  // 햄버거 메뉴 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 검색창 바인딩 상태
  const [inputSearch, setInputSearch] = useState("");

  // 검색 요청을 보낼 상태
  const [searchData, setSearchData] = useState<SearchSendCurricula>({
    curriculum_category: "",
    order: "",
    only_available: false,
    search: "",
    pageSize: 12,
    currentPageNumber: 1,
  });

  // 검색창 바인딩
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
    // 상태 업데이트
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 로그아웃 요청 함수
  const logoutbtn = () => {
    dispatch(logout());
    navigate("/home");
    window.location.reload();
  };

  // 검색 페이지에서 검색바로 검색하는 로직
  const handleInsideSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchCurricula(searchData));
  };

  // 검색페이지가 아닌 곳에서 검색바에서 검색 기능 구현할 핸들러
  const handleOutsideSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    searchParams.set("search", inputSearch);
    searchParams.set("order", searchData.order);
    searchParams.set("only_available", searchData.only_available.toString());
    searchParams.set("pageSize", searchData.pageSize.toString());
    searchParams.set(
      "currentPageNumber",
      searchData.currentPageNumber.toString()
    );

    // 검색어와 옵션들을 URL 파라미터로 포함시켜 이동
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <nav className="sticky top-0 flex flex-wrap items-center justify-between p-2 bg-Beige border-b-2 border-hardBeige z-10">
      {/* Navbar 로고 */}
      <Link to={"/home"}>
        <div className="w-28 ml-4">
          <img src={logoImage} alt="logo" className="w-full h-20" />
        </div>
      </Link>
      {/* 검색창 */}
      <div className="flex-1 flex items-center justify-between lg:justify-around">
        <form
          className="relative mx-2 lg:mx-4 flex-grow lg:flex-grow-0 lg:w-1/2"
          onSubmit={
            currentPath === "/search" ? handleInsideSearch : handleOutsideSearch
          }
        >
          <input
            type="text"
            name="search"
            placeholder="나의 성장을 도와줄 강의를 검색해보세요."
            className="p-2 border-2 w-full h-10 rounded-md border-hardBeige"
            value={inputSearch}
            onChange={(e) => handleChange(e)}
          />
          <button
            type="button"
            className="absolute right-3 inset-y-2 hover:text-orange-300"
            onClick={
              currentPath === "/search"
                ? handleInsideSearch
                : handleOutsideSearch
            }
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-6" />
          </button>
        </form>

        {/* 메뉴 */}
        <ul className="hidden lg:flex lg:flex-row lg:justify-between text-lg font-bold ml-4 lg:ml-0">
          <li className="mx-4 lg: m-2 lg:px-2 lg:py-0">
            <Link to={"/search"} className="hover:text-orange-300">
              강의
            </Link>
          </li>
          <li className="mx-4 lg: m-2 lg:px-2 lg:py-0">
            <Link
              to={`/teacher/profile/${teacherData.username}`}
              className="hover:text-orange-300"
            >
              내 강의실
            </Link>
          </li>
          <li className="mx-4 lg: m-2 lg:px-2 lg:py-0">
            <a href="#" className="hover:text-orange-300">
              문의하기
            </a>
          </li>
        </ul>
      </div>
      {/* 로그인 및 회원가입 버튼 */}
      <div className="hidden mr-3 lg:flex items-center ml-4 lg:ml-0">
        <button className="w-auto ml-2 p-2 border-2 border-hardBeige rounded-md">
          {username}선생님
        </button>

        <button
          className="w-auto ml-2 p-2 text-white bg-red-400 border-2 border-hardBeige rounded-md hover:bg-red-500"
          onClick={logoutbtn}
        >
          로그아웃
        </button>
      </div>
      {/* 햄버거 메뉴 아이콘 */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
        </button>
      </div>
      {/*  ------------------------------------------------------------------------------------------------------- */}
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="w-full flex flex-col lg:hidden">
          <ul className="flex flex-col w-full text-lg font-bold mt-4">
            <li className="p-2">
              <Link to={"/search"} className="hover:text-orange-300">
                강의
              </Link>
            </li>
            <li className="p-2">
              <Link
                to={`/teacher/profile/${teacherData.username}`}
                className="hover:text-orange-300"
              >
                내 강의실
              </Link>
            </li>
            <li className="p-2">
              <a href="#" className="hover:text-orange-300">
                문의하기
              </a>
            </li>
          </ul>

          <div className="flex flex-col items-center mt-4 mx-2">
            <button className="w-full mb-2 p-2 border-2 border-hardBeige rounded-md">
              {username}선생님
            </button>
            <button
              className="text-white bg-red-400 border-2 p-2 rounded-md hover:bg-red-500 w-full"
              onClick={logoutbtn}
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarTeacher;
