import React, { useEffect, useState } from 'react';
import dummyProfile from '../../assets/default-bot.png';
import axios from 'axios';
import './Section.css';
import CharacterCard from './CharacterCard';

// SectionField 컴포넌트
// 각 큰 카테고리 별로 하나의 세션 영역으로 관리하기 위한 컴포넌트 (예: 필드 기반 추천, 태그 기반 추천, 등록 날짜 기반 추천)
function SectionField({
  title,
  categories,
  cards,
  onCategoryClick,
  selectedCategories,
}) {
  return (
    <div className="section">
      {/* 섹션 제목 */}
      <h1 className="section-title">{title}</h1>
      {/* 카테고리 버튼 */}
      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-btn ${
              selectedCategories.includes(category.field_idx) ? 'selected' : ''
            }`}
            onClick={() => onCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {/* 캐릭터 카드 리스트 */}
      <div className="character-cards">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <CharacterCard card={card} index={index} key={index} />
          ))
        ) : (
          <p className="no-results">검색된 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const Section = () => {
  // 필드 기반 추천 섹션 상태 관리
  const [fieldBasedCards, setFieldBasedCards] = useState([]); // 필드 기반 캐릭터 카드 리스트
  const [fieldFilters, setFieldFilters] = useState([]); // 필드 필터링 상태
  const [fieldLimit, setFieldLimit] = useState(8); // 필드 데이터 요청 제한

  // 태그 기반 추천 섹션 상태 관리
  const [tagBasedCards, setTagBasedCards] = useState([]); // 태그 기반 캐릭터 카드 리스트
  const [tagFilters, setTagFilters] = useState([]); // 태그 필터링 상태
  const [tagLimit, setTagLimit] = useState(8); // 태그 데이터 요청 제한

  // 등록 날짜 기반 추천 섹션 상태 관리
  const [createdBasedCards, setCreatedBasedCards] = useState([]); // 등록 날짜 기반 캐릭터 카드 리스트
  const [createdLimit, setCreatedLimit] = useState(8); // 등록 날짜 데이터 요청 제한

  // API URL 관리
  const sectionApis = {
    field: 'http://localhost:8000/api/characters/field', // 필드 기반 추천 API
    tag: 'http://localhost:8000/api/characters/tag', // 태그 기반 추천 API
    new: 'http://localhost:8000/api/characters/new', // 등록 날짜 기반 추천 API
  };

  // API로부터 캐릭터 데이터를 가져오는 함수
  const fetchCharacters = async (apiUrl, params, setCards) => {
    try {
      // fields와 tags 파라미터를 쉼표로 구분된 문자열로 변환
      if (params.fields) params.fields = params.fields.join(',');
      if (params.tags) params.tags = params.tags.join(',');
      const response = await axios.get(apiUrl, { params }); // API 요청
      const cards = response.data.map((data) => ({
        image: dummyProfile, // 캐릭터 이미지
        name: data.char_name, // 캐릭터 이름
        description: data.char_description, // 캐릭터 설명
      }));
      setCards(cards); // 가져온 데이터를 상태에 저장
    } catch (error) {
      console.error(`캐릭터 목록 불러오기 오류: ${apiUrl}`, error);
    }
  };

  // 필드 기반 추천 섹션 클릭 이벤트 처리
  const handleFieldClick = (category) => {
    if (category.field_idx === -1) {
      // 초기화 버튼 클릭
      setFieldFilters([]); // 필터 초기화
      setFieldLimit(8); // limit 초기화
      fetchCharacters(sectionApis.field, {}, setFieldBasedCards); // 전체 데이터 로드
    } else if (category.field_idx === 0) {
      // 더보기 버튼 클릭
      setFieldLimit((prevLimit) => prevLimit + 8);
      fetchCharacters(
        sectionApis.field,
        { fields: fieldFilters, limit: fieldLimit + 8 }, // 기존 필터 유지하며 데이터 증가 요청
        setFieldBasedCards
      );
    } else {
      // 특정 필터 선택/해제
      const updatedFilters = fieldFilters.includes(category.field_idx)
        ? fieldFilters.filter((idx) => idx !== category.field_idx) // 필터 제거
        : [...fieldFilters, category.field_idx]; // 필터 추가
      setFieldFilters(updatedFilters);
      fetchCharacters(
        sectionApis.field,
        { fields: updatedFilters, limit: fieldLimit }, // 선택된 필터로 데이터 요청
        setFieldBasedCards
      );
    }
  };

  // 태그 기반 추천 섹션 클릭 이벤트 처리
  const handleTagClick = (category) => {
    if (category.field_idx === -1) {
      // 초기화 버튼 클릭
      setTagFilters([]); // 필터 초기화
      setTagLimit(8); // limit 초기화
      fetchCharacters(sectionApis.tag, {}, setTagBasedCards); // 전체 데이터 로드
    } else if (category.field_idx === 0) {
      // 더보기 버튼 클릭
      setTagLimit((prevLimit) => prevLimit + 8);
      fetchCharacters(
        sectionApis.tag,
        { tags: tagFilters, limit: tagLimit + 8 }, // 기존 필터 유지하며 데이터 증가 요청
        setTagBasedCards
      );
    } else {
      // 특정 필터 선택/해제
      const updatedFilters = tagFilters.includes(category.field_idx)
        ? tagFilters.filter((idx) => idx !== category.field_idx) // 필터 제거
        : [...tagFilters, category.field_idx]; // 필터 추가
      setTagFilters(updatedFilters);
      fetchCharacters(
        sectionApis.tag,
        { tags: updatedFilters, limit: tagLimit }, // 선택된 필터로 데이터 요청
        setTagBasedCards
      );
    }
  };

  // 등록 날짜 기반 추천 섹션 클릭 이벤트 처리
  const handleCreatedClick = (category) => {
    if (category.field_idx === 0) {
      // 더보기 버튼 클릭
      setCreatedLimit((prevLimit) => prevLimit + 8);
      fetchCharacters(
        sectionApis.new,
        { limit: createdLimit + 8 }, // limit 증가 요청
        setCreatedBasedCards
      );
    } else if (category.field_idx === -1) {
      // 초기화 버튼 클릭
      setCreatedLimit(8); // limit 초기화
      fetchCharacters(sectionApis.new, {}, setCreatedBasedCards); // 전체 데이터 로드
    }
  };

  // 컴포넌트가 렌더링될 때 초기 데이터 로드
  useEffect(() => {
    fetchCharacters(sectionApis.field, {}, setFieldBasedCards);
    fetchCharacters(sectionApis.tag, {}, setTagBasedCards);
    fetchCharacters(sectionApis.new, {}, setCreatedBasedCards);
  }, []);

  // 섹션 데이터 정의
  const sectionData = [
    {
      title: '필드 기반 추천',
      categories: [
        { name: '학교/아카데미', field_idx: 1 },
        { name: '연예계', field_idx: 2 },
        { name: '이세계', field_idx: 3 },
        { name: '무협 세계', field_idx: 4 },
        { name: '오피스', field_idx: 5 },
        { name: '우주', field_idx: 6 },
        { name: '동양', field_idx: 7 },
        { name: '서양', field_idx: 8 },
        { name: '현대', field_idx: 9 },
        { name: '반려동물', field_idx: 10 },
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: fieldBasedCards,
      onCategoryClick: handleFieldClick,
      selectedCategories: fieldFilters,
    },
    {
      title: '태그 기반 추천',
      categories: [
        { name: '태그01', field_idx: 1 },
        { name: '태그02', field_idx: 2 },
        { name: '태그03', field_idx: 3 },
        { name: '태그04', field_idx: 4 },
        { name: '태그05', field_idx: 5 },
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: tagBasedCards,
      onCategoryClick: handleTagClick,
      selectedCategories: tagFilters,
    },
    {
      title: '새로 나온 캐릭터',
      categories: [
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: createdBasedCards,
      onCategoryClick: handleCreatedClick,
      selectedCategories: [], // 선택 상태 없음
    },
  ];

  return (
    <div>
      {sectionData.map((section, index) => (
        <SectionField
          key={index}
          title={section.title}
          categories={section.categories}
          cards={section.cards}
          onCategoryClick={section.onCategoryClick}
          selectedCategories={section.selectedCategories}
        />
      ))}
    </div>
  );
};

export default Section;
