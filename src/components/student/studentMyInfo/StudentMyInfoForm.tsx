import { AppDispatch, RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchStudentInfo } from "../../../store/userInfo/StudentProfileSlice";
import StudentUpdateInfoModal from "./StudentUpdateInfoModal";

interface StudentMyInfoProps {
  handleIsUpdateInfoSubmit: (password: string) => void;
}

const StudentMyInfoForm: React.FC<StudentMyInfoProps> = ({
  handleIsUpdateInfoSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchStudentInfo());
  }, [dispatch]);
  const teacherData = useSelector(
    (state: RootState) => state.studentProfile.info
  );
  return (
    <div className="w-9/12 bg-moreBeige rounded-xl shadow-md p-6 my-12 mx-auto relative">
      <form>
        <h1 className="my-2 p-2 text-center text-4xl text-lightNavy">내정보</h1>
        <div className="my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">닉네임</label>
          <p>{teacherData?.nickname}</p>
        </div>
        <div className="my-4 p-2">
          <label className="my-2 text-2xl text-lightNavy">이메일</label>
          <p>{teacherData?.email}</p>
        </div>
      </form>
      <StudentUpdateInfoModal
        handleIsUpdateInfoSubmit={handleIsUpdateInfoSubmit}
      />
    </div>
  );
};

export default StudentMyInfoForm;
