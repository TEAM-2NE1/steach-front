import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { updateSearchState } from "../../../store/SearchSlice";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";
import { searchCurricula } from "../../../store/SearchSlice";
import all from "../../../assets/subject/booklist.png";
import korean from "../../../assets/subject/korean.png";
import math from "../../../assets/subject/math.png";
import social from "../../../assets/subject/social.png";
import science from "../../../assets/subject/science.png";
import artsandphysical from "../../../assets/subject/artsandphysical.png";
import foreignlanguage from "../../../assets/subject/foreignlanguage.png";
import engineering from "../../../assets/subject/engineering.png";
import etc from "../../../assets/subject/etc.png";

interface Subject {
  name: string;
  icon: string;
  value: string;
}

interface SearchCategoryMenuProps {
  setSearchOption: Dispatch<SetStateAction<SearchSendCurricula>>;
}

const SearchCategoryMenu: React.FC<SearchCategoryMenuProps> = ({
  setSearchOption,
}) => {
  // SearchSendCurricula와 상태 값을 이용한 상태 구조
  const searchData: SearchSendCurricula = {
    curriculum_category: useSelector(
      (state: RootState) => state.search.curriculum_category
    ),
    order: useSelector((state: RootState) => state.search.order),
    only_available: useSelector(
      (state: RootState) => state.search.only_available
    ),
    search: useSelector((state: RootState) => state.search.search),
    currentPageNumber: useSelector(
      (state: RootState) => state.search.current_page_number
    ),
    pageSize: useSelector((state: RootState) => state.search.page_size),
  };
  const dispatch = useDispatch<AppDispatch>();

  // 배열의 타입을 Subject 배열로 정의
  const subjects: Subject[] = [
    { name: "#전체", icon: all, value: "" },
    { name: "#국어", icon: korean, value: "KOREAN" },
    { name: "#수학", icon: math, value: "MATH" },
    { name: "#사회", icon: social, value: "SOCIAL" },
    { name: "#과학", icon: science, value: "SCIENCE" },
    { name: "#예체능", icon: artsandphysical, value: "ARTS_AND_PHYSICAL" },
    { name: "#공학", icon: engineering, value: "ENGINEERING" },
    { name: "#외국어", icon: foreignlanguage, value: "FOREIGN_LANGUAGE" },
    { name: "#기타", icon: etc, value: "ETC" },
  ];

  // 아이콘 클릭시 값을 변화시키는 핸들러 함수
  const handleChange = async (value: string) => {
    await dispatch(
      updateSearchState({
        ...searchData,
        curriculum_category: value,
      })
    );

    setSearchOption(() => ({ ...searchData }));

    dispatch(searchCurricula(searchData));
  };

  useEffect(() => {
    if (searchData.curriculum_category) {
      handleChange(searchData.curriculum_category);
    }
  }, [searchData.curriculum_category]);

  return (
    <section className="flex justify-center">
      <div className="flex text-center">
        {subjects.map((subject, index) => (
          <button
            key={index}
            type="button"
            className={`mx-6 my-12 p-2 rounded-md ${
              searchData.curriculum_category === subject.value
                ? "bg-orange-200"
                : ""
            }`}
            onClick={() => handleChange(subject.value)}
          >
            <img
              src={subject.icon}
              alt={subject.name}
              className="sm:size-8 md:size-12 lg:size-16 text-indigo-950"
            />
            <div className="text-lightNavy">{subject.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchCategoryMenu;
