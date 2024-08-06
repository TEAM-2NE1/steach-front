import FloatingEmoji from "./FloatingEmoji.tsx";
import QuizListComponent from "./QuizListComponent.tsx";

const QuizTest: React.FC = () => {
  return (
    <div className="grid grid-cols-12 bg-white ">
      <div className="col-span-1"></div>
      <h1>진짜판</h1>
      <div className="col-span-10">
        <QuizListComponent trialVersion={false} />
      </div>
      <div className="col-span-1"></div>
      <h1>체험판</h1>
      <div className="col-span-10">
        <QuizListComponent trialVersion={true} />
      </div>
      <FloatingEmoji/>
    </div>
  );
};

export default QuizTest;
