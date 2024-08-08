import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchSendCurricula } from "../../interface/search/SearchInterface";
import { searchCurricula } from "../../store/SearchSlice";
import { AppDispatch, RootState } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";
import SearchCategoryMenu from "../../components/main/search/SearchCategoryMenu";
import SearchOrderMenu from "../../components/main/search/SearchOrderMenu";
import SearchSwitch from "../../components/main/search/SearchSwitch";
import SearchCard from "../../components/main/search/SearchCard";
import SearchNoResult from "../../components/main/search/SearchNoResult";
import SearchPagination from "../../components/main/search/SearchPagination";
import Spinner from "../../components/main/spinner/Spinner";

const SearchPage: React.FC = () => {
  // params 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const params = new URLSearchParams(location.search);
  const status = useSelector((state: RootState) => state.search.status);
  const curriculas = useSelector((state: RootState) => state.search.curricula);

  // 검색 조건값 상태
  const [searchOption, setSearchOption] = useState<SearchSendCurricula>({
    curriculum_category: params.get("curriculum_category") || "",
    order: params.get("order") || "LATEST",
    only_available: params.get("only_available") === "true",
    search: params.get("search") || "",
    pageSize: parseInt(params.get("pageSize") || "12", 10),
    currentPageNumber: parseInt(params.get("currentPageNumber") || "1", 10),
  });

  useEffect(() => {
    const curriculum_category = params.get("curriculum_category") || "";
    const order = params.get("order") || "LATEST";
    const search = params.get("search") || "";
    const only_available = params.get("only_available") === "true";
    const pageSize = parseInt(params.get("pageSize") || "12", 10);
    const currentPageNumber = parseInt(
      params.get("currentPageNumber") || "1",
      10
    );

    const newSearchOption: SearchSendCurricula = {
      curriculum_category,
      order,
      search,
      only_available,
      pageSize,
      currentPageNumber,
    };

    console.log(newSearchOption);
    setSearchOption(newSearchOption);
    dispatch(searchCurricula(newSearchOption));
  }, [location.search]);

  // 검색 조건 값 양방향 바인딩
  const handleOptionChange = (e: {
    target: { name: string; value: string | boolean | number };
  }) => {
    const { name, value } = e.target;
    setSearchOption((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 검색 핸들러 함수
  const handleSearch = (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }

    const newSearchOption: SearchSendCurricula = {
      ...searchOption,
      currentPageNumber: 1,
    };

    setSearchOption(newSearchOption);
    const searchParams = new URLSearchParams();
    searchParams.set("search", searchOption.search);
    searchParams.set("curriculum_category", searchOption.curriculum_category);
    searchParams.set("order", searchOption.order);
    searchParams.set("only_available", searchOption.only_available.toString());
    searchParams.set("pageSize", searchOption.pageSize.toString());
    searchParams.set("currentPageNumber", "1");
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-1"></div>
      <main className="col-span-10">
        <form className="my-4" onSubmit={(e) => handleSearch(e)}>
          <div className="flex justify-center">
            <SearchCategoryMenu searchOption={searchOption} />
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
            <SearchPagination searchOption={searchOption} />
          </div>
        )}
      </main>
      <div className="col-span-1"></div>
    </div>
  );
};

export default SearchPage;
