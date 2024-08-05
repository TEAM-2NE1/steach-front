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
import { Swiper as SwiperClass } from "swiper/types";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchLatestCurricula } from "../../api/main/mainAPI";

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

export default function LatestLectures() {
  const [, setSwiper] = useState<SwiperClass>();
  const [, setIsBeginning] = useState(true);
  const [, setIsEnd] = useState(false);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLatestCurricula();
        setCurricula(data.curricula);
      } catch (error) {
        console.error("Failed to fetch latest curricula:", error);
      }
    };

    getData();
  }, []);

  return (
    <section className="flex justify-center py-6">
      <Box className="container mx-16 px-16">
        <header className="text-4xl text-lightNavy font-bold m-3">
          <h1>최근 등록된 강의</h1>
        </header>
        <Box className="flex justify-center">
          <Swiper
            onSlideChange={(e) => {
              setIsBeginning(e.isBeginning);
              setIsEnd(e.isEnd);
            }}
            onSwiper={(e) => {
              setSwiper(e);
            }}
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
                slidesPerView: 3,
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
                    <Image
                      src={curriculum.banner_img_url}
                      alt={curriculum.title}
                      borderRadius="lg"
                    />
                    <Stack mt="6" spacing="3" className="p-2">
                      <Heading fontSize="font-bold text-2xl">
                        {curriculum.title}
                      </Heading>
                      <Text>{curriculum.intro}</Text>
                      <Text className="text-slate-500">
                        {curriculum.teacher_name}
                      </Text>
                    </Stack>
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      className="p-2 text-lightNavy hover:text-hoverNavy"
                    >
                      자세히 보기
                    </Button>
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
