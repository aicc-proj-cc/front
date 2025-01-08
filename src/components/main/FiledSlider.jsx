import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./filedSlider.css";

import backgroundImage1 from "../../assets/DemonSlayer/banner01_1.png";
import backgroundImage2 from "../../assets/Naruto/banner01_1.png";

import character1 from "../../assets/DemonSlayer/tanjiro.png";
import character2 from "../../assets/DemonSlayer/giyu.png";
import character3 from "../../assets/DemonSlayer/shinobu.png";
import character4 from "../../assets/DemonSlayer/muichiro.png";
import character5 from "../../assets/DemonSlayer/zenitsu.png";

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
      title: "젠레스 존 제로 / Bangboo",
      description: "젠레스 존 제로의 인기 마스코트. \n인격을 지닌 인공지능 생명체 Bangboo를 만나보세요!",
      backgroundImage: backgroundImage1,
      gradientColor: "rgba(196, 33, 33, 0.5)", // 배너의 그라데이션 색상 지정
      characters: [
        { name: "공명부", image: character1 },
        { name: "버클러", image: character2 },
        { name: "샤크부", image: character3 },
        { name: "세이프티", image: character4 },
        { name: "최소한대원", image: character5 },
      ],
    },
    {
      title: "나루토 / Naruto",
      description: "전설적인 닌자들의 이야기. \n나루토와 친구들을 만나보세요!",
      backgroundImage: backgroundImage2,
      gradientColor: "rgba(33, 150, 243, 0.5)", // 다른 배너의 그라데이션 색상
      characters: [
        { name: "나루토", image: character1 },
        { name: "사스케", image: character2 },
        { name: "사쿠라", image: character3 },
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