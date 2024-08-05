import noQuizimg from "../../../assets/noQuizImage.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const NoQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();
  return (
    <>
      <div className="flex flex-col">
        <img src={noQuizimg} alt="no-image" className="size-96" />
        <button
          onClick={() =>
            navigate(
              `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/createQuiz`
            )
          }
        >
          퀴즈 생성하러가기
        </button>
      </div>
    </>
  );
};

export default NoQuiz;
