import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./filedSlider.css";

import backgroundImage1 from "../../assets/School/banner01_1.png";
import backgroundImage2 from "../../assets/Wuxia/banner01_1.png";
import backgroundImage3 from "../../assets/Modern/banner01_1.png";

import school001 from "../../assets/School/school001.png";

import wuxia001 from "../../assets/Wuxia/wuxia001.png";

import modern001 from "../../assets/Modern/modern001.png";
import modern002 from "../../assets/Modern/modern002.png";


const FiledSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const banners = [
    {
      title: "학교 / 아카데미",
      description: "파릇파릇한 청춘 이야기. \n학교/아카데미의 청춘 캐릭터들을 만나보세요!",
      backgroundImage: backgroundImage1,
      gradientColor: "rgba(196, 33, 33, 0.5)", // 배너의 그라데이션 색상 지정
      characters: [
        { name: "공명부", image: school001 },
      ],
    },
    {
      title: "무협 세계",
      description: "묻노니, 협이란 무엇인가? \n협에대한 이야기를 캐릭터 친구들과 나눠보세요!",
      backgroundImage: backgroundImage2,
      gradientColor: "rgba(196, 33, 33, 0.5)", // 다른 배너의 그라데이션 색상
      characters: [
        { name: "탄지로", image: wuxia001 },
      ],
    },
    {
      title: "현대 판타지",
      description: "현대 판타타지의 깐부 친구들을 만나보세요!",
      backgroundImage: backgroundImage3,
      gradientColor: "rgba(33, 150, 243, 0.5)", // 다른 배너의 그라데이션 색상
      characters: [
        { name: "이예린", image: modern001 },
        { name: "한채린", image: modern002 },
      ],
    },
  ];

  return (
    <div className="filed-slider">
      <Slider {...sliderSettings}>
        {banners.map((banner, index) => (
          <div key={index} className="slider-item">
            {/* 그라데이션 오버레이 */}
            <div
              className="gradient-overlay"
              style={{
                background: `linear-gradient(to right, ${banner.gradientColor}, transparent)`,
              }}
            ></div>

            {/* 배경 이미지 */}
            <div
              className="image-container"
              style={{
                backgroundImage: `url(${banner.backgroundImage})`,
              }}
            ></div>

            {/* 콘텐츠 */}
            <div className="banner-content">
              <div className="filed-text">
                <h2 className="filed-title">{banner.title}</h2>
                <p className="filed-description">{banner.description}</p>
              </div>

              <div className="filed-character-area">
                {banner.characters.map((character, idx) => (
                  <div key={idx} className="filed-character-card">
                    <img src={character.image} alt={character.name} />
                    <span>{character.name}</span>
                  </div>
                ))}
              </div>

              <div className="filed-button-area">
                <button className="filed-more-button">더보기</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FiledSlider;