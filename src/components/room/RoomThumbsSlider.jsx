import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { handleImageUrl } from "../../utils/utils";

const RoomThumbsSlider = ({images}) => {
  const [activeThumb, setActiveThumb] = useState(null);

  return (
    <div className={`rounded overflow-hidden space-y-3`}>
      <div className={`relative`}>
        <div className="swiper-controller absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-4 z-10">
          <div className="swiper-rts-button-prev flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
            <MdOutlineKeyboardArrowLeft />
          </div>
          <div className="swiper-rts-button-next flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
            <MdOutlineKeyboardArrowRight />
          </div>
        </div>
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: activeThumb }}
          navigation={{
            enabled: true,
            prevEl: ".swiper-rts-button-prev",
            nextEl: ".swiper-rts-button-next",
            disabledClass: "swiper-rts-button-disabled",
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={50}
          grabCursor={true}
        >
          <>
            {images?.map((image, idx) => (
              <SwiperSlide key={idx} className={`relative pt-[100%]`}>
                <img
                  src={handleImageUrl(image)}
                  alt=""
                  className={`absolute top-0 left-0 w-full h-full`}
                />
              </SwiperSlide>
            ))}
          </>
        </Swiper>
      </div>
      <Swiper
        modules={[Navigation, Thumbs]}
        onSwiper={setActiveThumb}
        loop={true}
        slidesPerView={3}
        spaceBetween={10}
      >
        <>
          {images?.map((image, idx) => (
            <SwiperSlide key={idx} className={`group cursor-pointer`}>
              <div className="relative pt-[100%]">
                <img
                  src={handleImageUrl(image)}
                  alt=""
                  className={`absolute top-0 left-0 w-full h-full opacity-50 group-[.swiper-slide-thumb-active]:border-4 group-[.swiper-slide-thumb-active]:border-green-slimy group-[.swiper-slide-thumb-active]:opacity-100`}
                />
              </div>
            </SwiperSlide>
          ))}
        </>
      </Swiper>
    </div>
  );
};

export default RoomThumbsSlider;
