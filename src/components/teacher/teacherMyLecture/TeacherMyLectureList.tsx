import {
  AccordionPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import hokyung from "../../../assets/futureHokyung.jpg";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  getCurriculaDetail,
  getCurriculaLectureList,
} from "../../../store/curriculaSlice";
import { deleteCurriculaDetail } from "../../../store/curriculaSlice";
import TeacherMyLectureListButton from "./TeacherMyLectureListButton";

const TeacherMyLectureList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // curricula_id 추출
  const { curricula_id } = useParams<{ curricula_id: string }>();

  // username 추출
  const userData = localStorage.getItem("auth");
  const username = userData ? JSON.parse(userData).username : null;

  // 커리큘럼 단일 상태를 조회하여
  const lectures = useSelector(
    (state: RootState) => state.curriculum.selectlectures
  );

  // 단일 커리큘럼에 대한 강의 리스트 상태를 조회
  const lectureslist = useSelector(
    (state: RootState) => state.curriculum.lectureslist
  );

  // 페이지에 들어왔을때 curricula_id를 이용하여 함수 실행하기
  useEffect(() => {
    if (curricula_id) {
      dispatch(getCurriculaDetail(curricula_id));
      dispatch(getCurriculaLectureList(curricula_id));
    }
  }, [curricula_id, dispatch]);

  // 디데이 계산
  let daysAgo: any;

  const calculateDaysAgo = (dateString: any) => {
    const targetDate: any = new Date(dateString);
    const today: any = new Date();
    const difference = today - targetDate;
    const daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환

    return daysAgo;
  };

  // 커리큘럼 삭제
  const handleCurriculaDelete = (curricula_id: string) => {
    dispatch(deleteCurriculaDetail(curricula_id));
    navigate(`/teacher/profile/${username}`);
    window.location.reload();
  };

  return (
    <div className="p-9 bg-Beige relative">
      <header className="text-4xl text-indigo-900">
        내 커리큘럼 {"->"} {lectures?.title}
      </header>
      <div className="absolute right-20">
        <button className="mx-2 p-3 rounded-md bg-violet-200 text-white shadow-md hover:bg-violet-300">
          커리큘럼 수정
        </button>
        <button
          // non-null assertion operator - curricula_id의 뒤에 !를 붙여서 null이나 undefined가 될 수 없다는 의미여서 타입 검사를 할 필요가 없다는 기능이다.
          onClick={() => handleCurriculaDelete(curricula_id!)}
          className="mx-2 p-3 rounded-md bg-red-200 text-white shadow-md hover:bg-red-300"
        >
          커리큘럼 삭제
        </button>
      </div>
      <section className="flex items-center my-7">
        <img
          src={hokyung}
          alt="no-image"
          className="mx-3 w-72 h-48 rounded-md shadow-md"
        />
        <main className="mx-4">
          <h1 className="my-3 text-2xl">{lectures?.sub_title}</h1>
          <p className="text-sm text-slate-500">
            {lectures?.start_date} ~ {lectures?.end_date}
          </p>
          <p className="text-sm text-slate-500">
            {lectures?.lecture_start_time}시 ~ {lectures?.lecture_end_time}시
          </p>
        </main>
      </section>

      <section className="mx-3 mt-12 mb-3 border-gray-300 p-4">
        <h1 className="my-3 text-3xl text-lightNavy">강의목록</h1>
        <Accordion className="shadow-lg" defaultIndex={[]} allowMultiple>
          <h2>
            {Array.from(
              { length: lectureslist?.week_count ?? 0 },
              (_, index) => (
                <AccordionItem
                  key={index}
                  className="rounded-lg"
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    overflow: "hidden",
                  }}
                >
                  <AccordionButton className="bg-hardBeige hover:bg-darkerBeige">
                    <Box as="span" flex="1" textAlign="left" className="p-2">
                      <Text className="text-2xl">
                        [{lectures?.title}] {index + 1}주차 강의
                      </Text>
                      <Text className="text-base text-gray-600">
                        {" "}
                        {daysAgo > 0
                          ? `이미 끝난 강의입니다.`
                          : daysAgo < 0
                          ? `${-daysAgo}일 후 강의입니다.`
                          : "오늘 강의입니다."}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} className="p-3 bg-white">
                    {Array.from(
                      { length: lectureslist?.lectures[index + 1].length ?? 0 },
                      (_, index2) => (
                        <div
                          key={index2}
                          className="grid grid-cols-4 border-b-2 border-hardBeige pt-1"
                        >
                          <div className="col-span-2">
                            <h2 className="text-xl">
                              {
                                lectureslist?.lectures[index + 1][index2]
                                  .lecture_title
                              }
                            </h2>
                            <p></p>
                          </div>
                          <div className="flex col-span-1 text-right md:justify-left lg:justify-end">
                            <header>
                              <p>강의 날짜 : </p>
                              <p>시작 시간 : </p>
                            </header>
                            <main>
                              <p>
                                {lectureslist?.lectures[index + 1][
                                  index2
                                ].lecture_start_time.slice(0, 10)}
                              </p>
                              <p>
                                {lectureslist?.lectures[index + 1][
                                  index2
                                ].lecture_start_time.slice(11, 19)}
                              </p>
                              <p className="hidden">
                                {
                                  (daysAgo = calculateDaysAgo(
                                    lectureslist?.lectures[index + 1][
                                      index2
                                    ].lecture_start_time.slice(0, 10)
                                  ))
                                }
                              </p>
                            </main>
                          </div>
                          <div className="flex justify-end items-center col-span-1">
                            {daysAgo > 0 ? (
                              <TeacherMyLectureListButton
                                lectureState={"completed"}
                                lectureId={
                                  lectureslist?.lectures[index + 1][index2]
                                    .lecture_id
                                }
                                curriculaId={curricula_id}
                                username={username}
                              />
                            ) : daysAgo < 0 ? (
                              <TeacherMyLectureListButton
                                lectureState={"scheduled"}
                                lectureId={
                                  lectureslist?.lectures[index + 1][index2]
                                    .lecture_id
                                }
                                curriculaId={curricula_id}
                                username={username}
                              />
                            ) : (
                              <TeacherMyLectureListButton
                                lectureState={"ongoing"}
                                lectureId={
                                  lectureslist?.lectures[index + 1][index2]
                                    .lecture_id
                                }
                                curriculaId={curricula_id}
                                username={username}
                              />
                            )}
                          </div>
                          <hr></hr>
                        </div>
                      )
                    )}
                  </AccordionPanel>
                </AccordionItem>
              )
            )}
          </h2>
        </Accordion>
      </section>
    </div>
  );
};

export default TeacherMyLectureList;
