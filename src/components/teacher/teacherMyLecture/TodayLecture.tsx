import React from "react";
// import {
//   Card,
//   Heading,
//   CardBody,
//   Stack,
//   Text,
//   Image,
//   Box,
// } from "@chakra-ui/react";
import "swiper/swiper-bundle.css";
//import { Swiper, SwiperSlide } from "swiper/react";

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
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    title: "김호경의 Unity 커리큘럼",
    time: "매주 화, 목 오후 4시 0분 ~ 오후 5시 0분",
    teacher: "김호경",
  },
];

const TodayLecture: React.FC = () => {
  return (
    <div className="flex flex-col space-y-8 mx-20 my-4">
      <h1 className="text-4xl text-lightNavy">내가 강의하는 커리큘럼</h1>
      {samples.map((sample, index) => (
        <div
          key={index}
          className="flex border rounded-lg overflow-hidden shadow-md w-full bg-white"
        >
          <img
            src={sample.image}
            alt="no-image"
            className="w-1/3 object-cover"
          />
          <div className="p-4 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">{sample.title}</h2>
            <p className="text-gray-700 mb-4">{sample.time}</p>
            <p className="text-gray-700 mb-4">{sample.teacher} 선생님</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              자세히 보기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodayLecture;

//{
/* <section className="flex justify-center my-6">
        <Box className="container mx-10 px-6">
          <header className="text-lightNavy font-bold m-3">
            <h1 className="sm:text-sm md:text-xl lg:text-3xl xl:text-4xl">
              오늘의 강의
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
                  <div className="flex border rounded-lg overflow-hidden shadow-md w-full max-w-md">
                    <img
                      src={sample.image}
                      alt="no-image"
                      className="w-1/3 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold mb-2">
                        {sample.title}
                      </h2>
                      <p className="text-gray-700 mb-4">{sample.time}</p>
                      <p className="text-gray-700 mb-4">
                        {sample.teacher} 선생님
                      </p>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </section> */
