import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// 이진송 - 디자인 정한것에 맞춰서 짜야 함
// 디자인 이외에 구체적인건 axios 받고 해야할 듯
const TeacherInfoDetail: React.FC = () => {
  const navigate = useNavigate();

  const lectures = useSelector(
    (state: RootState) => state.lectures.lectureslist
  );
  const status = useSelector((state: RootState) => state.lectures.status);
  const error = useSelector((state: RootState) => state.lectures.error);
  console.log(lectures);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-[#000000] grid grid-cols-12">
        <div className="col-span-1"></div>
        <div className="col-span-3 bg-[#009900] p-4 m-4">
          <img />
          여기강사사진이들어갈거같은데
        </div>
        <div className="col-span-7 bg-[#999999] p-4 m-4">
          <h1 className="text-6xl">강사 이름</h1>
          <div className="whitespace-pre-line break-words">
            <h1 className="text-6xl">강사 소개</h1>
            내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임내가이런사람임
          </div>
          <br className="text-black"></br>
          <h1 className="text-6xl">강의 분야</h1>
          국영수영탐 이름
          <h1 className="text-6xl">주요 학력</h1>
          <div className="whitespace-pre-line break-words">
            내가 무슨학교 학생이냐면 개쩔지않냐고
          </div>
          <button
            onClick={() => {
              navigate("/teacher/profiledetail/update");
            }}
          >
            dd
          </button>
        </div>
        <div className="col-span-1"></div>
      </div>
    </>
  );
};

export default TeacherInfoDetail;
