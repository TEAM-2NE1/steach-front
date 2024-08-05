import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const imageUrls = [
  "https://cdn.m-i.kr/news/photo/202405/1119678_887147_344.jpg",
  "https://mblogthumb-phinf.pstatic.net/MjAyNDAxMzFfMTE5/MDAxNzA2NjkwOTQ1NjY1.DE4CKXk67V-GF8veQ4uGeWY_oEbwBLgf2pCXCWDRDwkg.32FUNPUbJAfEuHGVlL0JAcfgoIdM75KBlOuv6EFg5HEg.PNG.bee4sunset/%EB%A7%88%EB%A3%A8_%EC%98%88%EC%8B%9C-01.png?type=w800",
  "https://cdn.imweb.me/upload/a7c97c29da69a.png",
  "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202401/17/f1984fc9-dd96-4ccf-93e4-7b5064d1bebf.jpg",
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
