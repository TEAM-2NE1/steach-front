import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { getStudentCurriculas } from "../../store/userInfo/StudentProfileSlice";
import { Curricula } from "../../interface/Curriculainterface";
import Spinner from "../../components/main/spinner/Spinner";
import defaultImg from "../../assets/default.png";
import {
  Card,
  Heading,
  CardBody,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";

interface LectureSwiperProps {
  title: string;
}

const LectureSwiper: React.FC<LectureSwiperProps> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getStudentCurriculas());
  }, [dispatch]);

  // 프로필 슬라이스 상태에 저장된 수강신청한 커리큘럼 목록 가져오기
  const examples: Curricula[] = useSelector(
    (state: RootState) => state.studentProfile.curricula
  );
  const status = useSelector(
    (state: RootState) => state.studentProfile.status
  );

  return (
    <section className="flex justify-center my-6">
      <Box className="container mx-10 px-6">
        <header className="text-lightNavy font-bold m-3">
          <h1 className="sm:text-sm md:text-xl lg:text-3xl xl:text-4xl">
            {title}
          </h1>
        </header>
        <Box className="flex justify-center">
          {examples.length === 0 ? (
            <div className="flex items-center justify-center">
              <button
                className="text-xl text-center text-gray-500 w-96 h-96"
                onClick={() => navigate("/search")}
              >
                <div className="bg-pink-300 p-3 rounded-2xl">
                강의가 없어요 !!
                강의 추천 받으러 가기 !!
                </div>
                <img
                  src="http://steach.ssafy.io:8082/img-upload/display/my/tqkjrsgonsimage-re.png"
                  className="p-3"
                />
              </button>
              {/* <button>강의 추천 받으러 가기</button> */}
            </div>
          ) : (
            <Swiper
              slidesPerView={1}
              navigation
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 2,
                },
                1280: {
                  slidesPerView: 3,
                },
              }}
              className="flex justify-center grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {examples.map((sample, index) => (
                <SwiperSlide key={index}>
                  <Card className="mx-5 bg-white rounded-lg shadow overflow-hidden">
                    <CardBody>
                      <Image
                        src={sample.banner_img_url ? sample.banner_img_url : defaultImg}
                        alt="no-image"
                        borderRadius="lg"
                        onError={(e) => {
                          e.currentTarget.src = defaultImg;
                        }}
                        className="w-screen h-52"
                      />
                      <Stack mt="6" spacing="3" className="p-2">
                        <Heading className="font-bold text-2xl">
                          {sample.title}
                        </Heading>
                        <Text>
                          {sample.start_date} ~ {sample.end_date}
                        </Text>
                        <Text className="text-slate-500">
                          {sample.teacher_name} 선생님
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>
      </Box>
      {status === "loading" && <Spinner />}
    </section>
  );
};

const ScheduledLectures: React.FC = () => {
  return (
    <>
      <LectureSwiper title="오늘의 강의" />
      <LectureSwiper title="예정 된 수업이 있어요 ~" />
    </>
  );
};

export default ScheduledLectures;
