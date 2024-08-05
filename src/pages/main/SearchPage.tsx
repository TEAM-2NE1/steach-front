import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SearchSendCurricula } from "../../interface/search/SearchInterface";
import { searchCurricula } from "../../store/SearchSlice";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import SearchCategoryMenu from "../../components/main/search/SearchCategoryMenu";
import SearchOrderMenu from "../../components/main/search/SearchOrderMenu";
import SearchSwitch from "../../components/main/search/SearchSwitch";
import SearchCard from "../../components/main/search/SearchCard";

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const curriculas = useSelector((state: RootState) => state.search.curricula);

  // 검색 조건값 상태
  const [searchOption, setSearchOption] = useState<SearchSendCurricula>({
    curriculum_category: "",
    order: "",
    only_available: false,
    search: "",
    pageSize: null,
    currentPageNumber: null,
  });

  // 검색 조건 값 양방향 바인딩
  const handleOptionChange = (e: {
    target: { name: string; value: string | boolean };
  }) => {
    const { name, value } = e.target;
    setSearchOption({
      ...searchOption,
      [name]: value,
    });
  };

  // 검색 핸들러 함수
  const handleSearch = () => {
    dispatch(searchCurricula(searchOption));
  };

  return (
    <div>
      <SearchCard />
      <form className="flex items-center">
        <SearchCategoryMenu handleOptionChange={handleOptionChange} />
        <SearchOrderMenu handleOptionChange={handleOptionChange} />
        <SearchSwitch handleOptionChange={handleOptionChange} />
        <button className="mx-2 p-3  rounded-md bg-red-200 text-white hover:bg-red-300">
          검색하기
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
