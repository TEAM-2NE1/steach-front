import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchSendCurricula } from "../../interface/search/SearchInterface";
import { searchCurricula, updateSearchState } from "../../store/SearchSlice";
import { AppDispatch, RootState } from "../../store";
import { useLocation } from "react-router-dom";
import SearchCategoryMenu from "../../components/main/search/SearchCategoryMenu";
import SearchOrderMenu from "../../components/main/search/SearchOrderMenu";
import SearchSwitch from "../../components/main/search/SearchSwitch";
import SearchCard from "../../components/main/search/SearchCard";
import SearchNoResult from "../../components/main/search/SearchNoResult";
import SearchPagination from "../../components/main/search/SearchPagination";
import Spinner from "../../components/main/spinner/Spinner";

const SearchPage: React.FC = () => {
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

  // params 가져오기
  let subject: string = "";
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = useSelector((state: RootState) => state.search.status);
  const curriculas = useSelector((state: RootState) => state.search.curricula);

  const [searchOption, setSearchOption] = useState<SearchSendCurricula>({
    ...searchData,
  });

  useEffect(() => {
    const paramSubject = params.get("subject");
    console.log(paramSubject);

    if (!paramSubject) {
      // 메인 페이지에서 과목 버튼을 클릭하지 않고 들어올 경우
      const initialSearchOption = {
        curriculum_category: "",
        order: "",
        only_available: false,
        search: "",
        currentPageNumber: 1,
        pageSize: 12,
      };
      setSearchOption(initialSearchOption);
      const fetchData = async () => {
        await dispatch(updateSearchState(initialSearchOption));
        dispatch(searchCurricula(initialSearchOption));
      };

      fetchData();
    } else {
      // 메인 페이지에서 과목 버튼을 클릭하고 들어올 경우
      const updatedSearchOption = {
        ...searchData,
        curriculum_category: paramSubject,
        currentPageNumber: 1,
      };
      setSearchOption(updatedSearchOption);
      const fetchData = async () => {
        await dispatch(updateSearchState(updatedSearchOption));
        dispatch(searchCurricula(updatedSearchOption));
      };

      fetchData();
    }
  }, [location.search, searchData.curriculum_category]);

  // 검색 조건 값 변경 시 리덕스 상태와 로컬 상태를 함께 업데이트
  const handleOptionChange = (e: {
    target: { name: string; value: string | boolean | number };
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
      currentPageNumber: 1,
    }));
    dispatch(
      searchCurricula({ ...searchOption, curriculum_category: category })
    );
  };

  // 검색 핸들러 함수
  const handleSearch = async (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }

    console.log(searchOption);
    await dispatch(
      updateSearchState({
        // 리덕스 상태 업데이트
        ...searchOption,
      })
    );

    dispatch(searchCurricula(searchOption));
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-1"></div>
        <main className="col-span-10">
          <form className="my-4" onSubmit={(e) => handleSearch(e)}>
            <div className="flex justify-center">
              <SearchCategoryMenu setSearchOption={setSearchOption} />
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
                searchOption={searchOption}
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
              <SearchPagination
                searchOption={searchOption}
                handleSearch={handleSearch}
                setSearchOption={setSearchOption}
              />
            </div>
          )}
        </main>
        <div className="col-span-1"></div>
      </div>
    </>
  );
};

export default SearchPage;
