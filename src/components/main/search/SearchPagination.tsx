import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";
import { useDispatch } from "react-redux";
import { searchCurricula } from "../../../store/SearchSlice";
import { AppDispatch } from "../../../store";

interface SearchPaginationProps {
  handleSearch: (e: React.FormEvent | null) => void;
  setSearchOption: React.Dispatch<React.SetStateAction<SearchSendCurricula>>;
  searchOption: SearchSendCurricula;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
  setSearchOption,
  searchOption,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // 중앙 저장소에서 총 페이지 수 가져오기
  const total_page = useSelector((state: RootState) => state.search.total_page);

  // 전체 페이지 수를 활용하여 숫자 배열을 만들기
  const pages = Array.from({ length: total_page }, (_, i) => i + 1);

  // 기존 상태를 변화시켜서 pagination을 구현하려고 하면 이전 상태 값으로 요청이 보내지기 때문에 (비동기적 처리)
  // 페이지에 대한 올바른 정보가 출력되지 않기 때문에 새로운 상태 객체와 새로운 함수를 만들어서 요청을 보내는 방법을 선택하였음.
  const handleSearchNewOption = (newSearchOption: SearchSendCurricula) => {
    dispatch(searchCurricula(newSearchOption));
  };

  const handlePageChange = (page: number) => {
    setSearchOption((prevState) => {
      const updatedSearchOption = {
        ...prevState,
        currentPageNumber: page,
      };
      handleSearchNewOption(updatedSearchOption);
      return updatedSearchOption;
    });
  };

  return (
    <div className="flex justify-center my-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mx-1 px-3 py-1 border ${
            searchOption.currentPageNumber === page
              ? "bg-red-200 text-white"
              : "bg-white"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPagination;
