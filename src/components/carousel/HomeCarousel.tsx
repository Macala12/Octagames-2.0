import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type SlideItem = {
  id: string;
  title: string;
  image: string;
};

interface Props {
  items: SlideItem[];
}

const HomeCarousel: React.FC<Props> = ({ items }) => {
  return (
    <div className="w-100">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1.2}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="rounded-xl"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-[180px] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-100 h-100 object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">
                  {item.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;