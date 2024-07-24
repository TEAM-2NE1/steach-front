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

interface Sample {
  image: string;
  title: string;
  time: string;
  teacher: string;
}

const samples: Sample[] = [
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 강의",
    time: "오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
];

interface LectureSwiperProps {
  title: string;
}

const LectureSwiper: React.FC<LectureSwiperProps> = ({ title }) => {
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
            {samples.map((sample, index) => (
              <SwiperSlide key={index}>
                <Card className="m-3 bg-white rounded-lg shadow overflow-hidden">
                  <CardBody>
                    <Image
                      src={sample.image}
                      alt="no-image"
                      borderRadius="lg"
                    />
                    <Stack mt="6" spacing="3" className="p-2">
                      <Heading className="font-bold text-2xl">
                        {sample.title}
                      </Heading>
                      <Text>{sample.time}</Text>
                      <Text className="text-slate-500">
                        {sample.teacher} 선생님
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
      <LectureSwiper title="지금 선생님이 수업을 시작했어요!" />
      <LectureSwiper title="예정 된 수업이 있어요 ~" />
    </>
  );
};

export default ScheduledLectures;
