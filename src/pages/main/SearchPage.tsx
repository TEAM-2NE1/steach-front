import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SearchSendCurricula } from "../../interface/search/SearchInterface";
import { searchCurricula } from "../../store/SearchSlice";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import SearchCategoryMenu from "../../components/main/search/SearchCategoryMenu";
import SearchOrderMenu from "../../components/main/search/SearchOrderMenu";
import SearchSwitch from "../../components/main/search/SearchSwitch";
import SearchCard from "../../components/main/search/SearchCard";
import SearchNoResult from "../../components/main/search/SearchNoResult";
import Spinner from "../../components/main/spinner/Spinner";
import { useLocation } from 'react-router-dom'

const SearchPage: React.FC = () => {
  // params 가져오기
  let subject:string = ""
  const location = useLocation();
  const params = new URLSearchParams(location.search)
  
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.search.status);
  const curriculas = useSelector((state: RootState) => state.search.curricula);
  
  // 검색 조건값 상태
  const [searchOption, setSearchOption] = useState<SearchSendCurricula>({
    curriculum_category: subject,
    order: "LATEST",
    only_available: false,
    search: "",
    pageSize: null,
    currentPageNumber: null,
  });

  // 홈페이지에서 클릭 후 넘어왔을때, params로 과목을 넘김
  useEffect(() => {
    const paramSubject = params.get('subject');
    if (paramSubject !== null) {
      subject = paramSubject;
    }
  }, [location.search])

  
  useEffect(() => {
    setSearchOption(prevState => ({
      ...prevState,
      curriculum_category: subject,
    }));
    if (!subject) {

      dispatch(searchCurricula(searchOption));
    }
  }, []);

  // 검색 조건 값 양방향 바인딩
  const handleOptionChange = (e: {
    target: { name: string; value: string | boolean };
  }) => {
    const { name, value } = e.target;
    setSearchOption((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 과목 클릭 시 바로 데이터를 불러오기 위한 함수
  const handleCategoryChange = (category: string) => {
    setSearchOption((prevState) => ({
      ...prevState,
      curriculum_category: category,
    }));
    dispatch(
      searchCurricula({ ...searchOption, curriculum_category: category })
    );
  };

  // 검색 핸들러 함수
  const handleSearch = (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }

    console.log("Search triggered", searchOption);
    dispatch(searchCurricula(searchOption));
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-1"></div>
        <main className="col-span-10">
          <form className="my-4" onSubmit={(e) => handleSearch(e)}>
            <div className="flex justify-center">
              <SearchCategoryMenu
                handleCategoryChange={handleCategoryChange}
                initialCategory={searchOption.curriculum_category}
              />
            </div>
            <div className="flex justify-evenly items-center">
              <SearchOrderMenu handleOptionChange={handleOptionChange} />
              <input
                type="text"
                name="search"
                className="ml-3 p-3 w-2/3 border-2 rounded-md"
                value={searchOption.search}
                onChange={(e) => handleOptionChange(e)}
              />
              <button
                type="submit"
                className="mr-2 p-3 rounded-md bg-red-200 text-white hover:bg-red-300"
              >
                검색하기
              </button>
              <SearchSwitch
                handleOptionChange={handleOptionChange}
                handleSearch={handleSearch}
              />
            </div>
          </form>
          {status === "loading" && <Spinner />}
          {status === "succeeded" && curriculas.length === 0 && (
            <SearchNoResult />
          )}
          {status === "succeeded" && curriculas.length > 0 && (
            <div className="my-10">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {curriculas.map((curriculum) => (
                  <SearchCard
                    key={curriculum.curriculum_id}
                    curriculum={curriculum}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="col-span-1"></div>
      </div>
    </>
  );
};

export default SearchPage;
