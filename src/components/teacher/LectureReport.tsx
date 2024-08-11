const LectureReport: React.FC = () => {
  // CREATE TABLE `lectures_students`
  // (
  //     `id`          INTEGER(11) NOT NULL AUTO_INCREMENT,     -- 수업-학생 관계 테이블 ID
  //     `student_id`  INTEGER(11) NOT NULL,                    -- 학생 고유 ID
  //     `lecture_id`  INTEGER(11) NOT NULL,                    -- 수업 고유 ID
  //     `focus_ratio` DECIMAL(5, 2) NULL,                      -- 수업 참여도
  //     `focus_time`  SMALLINT(6) NOT NULL,                    -- 수업에 집중한 시간(분)
  //     `quiz_answer_count` SMALLINT(6) NOT NULL DEFAULT 0,    -- 수업에서 맞힌 총 정답 개수
  //     `quiz_total_score` SMALLINT(6) NOT NULL DEFAULT 0,     -- 수업에서 맞힌 총 퀴즈 점수
  return (
    <div className="min-h-screen">
      <div className="p-6">
        <header className="my-2 text-5xl text-indigo-900 font-semibold">
          강의 리포트
        </header>
        <div className="flex my-5 text-amber-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-2xl"
          >
            <path
              fillRule="evenodd"
              d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="text-2xl text-amber-800">
            김호경의 C++ 교실(lectures.title) / 1강(lectures.lecture_order)
          </div>
        </div>
        <main>
          <section className="xl:my-12 2xl:my-14">
            <h1 className="mx-3 text-4xl text-lightNavy font-bold">
              전체 통계
            </h1>
            <div className="mx-3 my-4 size-2/6 bg-fuchsia-100 text-xl rounded-md shadow-md">
              <p className="p-3">평균참여도 : 90%</p>
              <p className="p-3">퀴즈점수 평균 : 950점</p>
              <p className="p-3">맞춘 갯수 평균 : 9.3개</p>
            </div>
          </section>
          <section className="2xl:mt-36">
            <h1 className="mx-3 text-4xl text-lightNavy font-bold">
              개별 통계
            </h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl: gap-4">
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>학생 이름(student_id) 조시현</p>
                <p>수업참여도(focus_ratio) 90%</p>
                <p>퀴즈 점수(quiz_total_score) 950</p>
                <p>퀴즈 점수(quiz_answer_count) 9/10</p>
              </div>
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>학생 이름(student_id) 조시현</p>
                <p>수업참여도(focus_ratio) 90%</p>
                <p>퀴즈 점수(quiz_total_score) 950</p>
                <p>퀴즈 점수(quiz_answer_count) 9/10</p>
              </div>

              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>학생 이름(student_id) 조시현</p>
                <p>수업참여도(focus_ratio) 90%</p>
                <p>퀴즈 점수(quiz_total_score) 950</p>
                <p>퀴즈 점수(quiz_answer_count) 9/10</p>
              </div>
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>학생 이름(student_id) 조시현</p>
                <p>수업참여도(focus_ratio) 90%</p>
                <p>퀴즈 점수(quiz_total_score) 950</p>
                <p>퀴즈 점수(quiz_answer_count) 9/10</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LectureReport;
