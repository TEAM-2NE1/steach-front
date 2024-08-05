import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  CardBody,
  Stack,
  Text,
  Image,
  Button,
  Box,
} from "@chakra-ui/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchPopularCurricula } from "../../api/main/mainAPI";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/default.png";

// 김헌규 제작
// 이진송 수정 - 타입스크립트에 맞춰서 변경함
// 김헌규 수정 - Card Border 둥글게 변경, Card 및 제목 글자 크기 변경, Card overflow-hidden 설정
// 김헌규 - 화면 크기에 따른 슬라이드 출력 갯수 수정
SwiperCore.use([Navigation, Pagination]);

interface Curriculum {
  curriculum_id: number;
  banner_img_url: string;
  title: string;
  intro: string;
  max_attendees: number;
  current_attendees: number;
  created_at: string;
  teacher_name: string;
}

export default function HotLectures() {
  const navigate = useNavigate();
  const [curricula, setCurricula] = useState<Curriculum[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchPopularCurricula();
        setCurricula(data.curricula);
      } catch (error) {
        console.error("Failed to fetch popular curricula:", error);
      }
    };
    getData();
  }, []);

  return (
    <section className="flex justify-center py-6">
      <Box className="container mx-16 px-16">
        <header className="m-3 text-4xl text-lightNavy font-bold">
          <h1>요즘 뜨는 강의</h1>
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
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="flex justify-center grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {curricula.map((curriculum) => (
              <SwiperSlide key={curriculum.curriculum_id}>
                <Card className="m-3 bg-white rounded-xl shadow overflow-hidden">
                  <CardBody>
                  <Box className="relative">
                      <button
                        className="absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col items-start"
                        onClick={() => { navigate(`/curricula/detail/${curriculum.curriculum_id}`)}}
                      >
                        <div className="flex flex-col h-full p-2">
                          <div>
                            <Text className="text-white text-2xl text-left pb-2">강의 소개</Text>
                            <Text className="text-white text-lg text-left">{curriculum.intro}</Text>
                          </div>
                          <Text className="text-white text-lg absolute bottom-3 right-3">수강 인원 {curriculum.current_attendees}/{curriculum.max_attendees}</Text>
                        </div>
                    </button>
                    <Image
                      src={curriculum.banner_img_url ? curriculum.banner_img_url : defaultImg}
                      alt={curriculum.title}
                      borderRadius="lg"
                      onError={(e) => { e.currentTarget.src = defaultImg }}
                      className="w-60 h-40"
                    />
                    <Stack mt="6" spacing="3" className="p-2">
                      <Heading className="font-bold text-2xl overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                        {curriculum.title}
                      </Heading>
                      <Text className="overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1, // 원하는 줄 수로 설정 (여기서는 3줄)
                        whiteSpace: 'normal'
                      }}>{curriculum.intro}</Text>
                      <Text className="text-slate-500">
                        {curriculum.teacher_name}
                      </Text>
                    </Stack>
                   </Box>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        </Box>
        </section>
      );
    }
