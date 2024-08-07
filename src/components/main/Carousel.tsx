import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const imageUrls = [
  "http://steach.ssafy.io:8082/img-upload/display/my/ttmdhvxbgb무제-3.png",
  "http://steach.ssafy.io:8082/img-upload/display/my/gdqhhamtsh무제-2.png",
  "http://steach.ssafy.io:8082/img-upload/display/my/iidswopebx무제-1.png",
  "http://steach.ssafy.io:8082/img-upload/display/my/rlyahgomzo무제-4.png",
];

const generateSlides = (urls: string[]) => {
  return urls.map((url, index) => (
    <SwiperSlide key={index}>
      <img src={url} alt={`slide-${index}`} style={imageStyle} />
    </SwiperSlide>
  ));
};

const HomePageCarousel: React.FC = () => {
  return (
    <>
      <style>{`
        .mySwiper {
          width: 100%;
          height: 30rem;
        }

        .carousel-image {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 100%;
          margin: 0 auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <Swiper
        loop={true}
        navigation={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        speed={1800}
      >
        {generateSlides(imageUrls)}
      </Swiper>
    </>
  );
};

const imageStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default HomePageCarousel;
