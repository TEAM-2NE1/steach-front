import React from "react";
import {
  Card,
  Heading,
  CardBody,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getStudentCurriculas } from "../../store/userInfo/StudentProfileSlice";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Curricula } from "../../interface/Curriculainterface";

interface LectureSwiperProps {
  title: string;
}

const LectureSwiper: React.FC<LectureSwiperProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getStudentCurriculas());
  }, [dispatch]);

  // 프로필 슬라이스 상태에 저장된 수강신청한 커리큘럼 목록 가져오기
  const examples: Curricula[] = useSelector(
    (state: RootState) => state.studentProfile.curricula
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
                <Card className="m-3 bg-white rounded-lg shadow overflow-hidden">
                  <CardBody>
                    <Image
                      src={sample.banner_img_url}
                      alt="no-image"
                      borderRadius="lg"
                    />
                    <Stack mt="6" spacing="3" className="p-2">
                      <Heading className="font-bold text-2xl">
                        {sample.title}
                      </Heading>
                      <Text>
                        {sample.start_date} ~ {sample.end_date}까지
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
        </Box>
      </Box>
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
