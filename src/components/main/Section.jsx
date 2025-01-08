import React, { useEffect, useState, useMemo } from 'react';
import dummyProfile from '../../assets/default-bot.png';
import axios from 'axios';
import './Section.css';
import CharacterCard from './CharacterCard';
import CharacterModal from './CharacterModal';

function SectionField({
  title,
  categories,
  cards,
  onCategoryClick,
  selectedCategories,
  onCardClick,
}) {
  return (
    <div className="section">
      <h1 className="section-title">{title}</h1>
      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={`${category.field_idx || category.tag_name}-${index}`} // 고유한 key 값 생성
            className={`category-btn ${
              selectedCategories.includes(
                category.field_idx || category.tag_name
              )
                ? 'selected'
                : ''
            }`}
            onClick={() => onCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="character-cards">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <CharacterCard
              card={card}
              index={index}
              key={`card-${card.char_idx}-${index}`}
              onClick={() => onCardClick(card)}
            />
          ))
        ) : (
          <p className="no-results">검색된 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const Section = () => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [fieldCategories, setFieldCategories] = useState([]);

  const [fieldFilters, setFieldFilters] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);
  const [fieldLimit, setFieldLimit] = useState(12);
  const [tagLimit, setTagLimit] = useState(12);
  const [createdLimit, setCreatedLimit] = useState(12);

  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [charactersResponse, tagsResponse, fieldsResponse] =
          await Promise.all([
            axios.get('http://localhost:8000/api/characters/'),
            axios.get('http://localhost:8000/api/tags'),
            axios.get('http://localhost:8000/api/fields'),
          ]);

        console.log('Fetched Characters:', charactersResponse.data); // 캐릭터 데이터 로그
        console.log('Fetched Tags:', tagsResponse.data); // 태그 데이터 로그
        console.log('Fetched Fields:', fieldsResponse.data); // 필드 데이터 로그

        setAllCharacters(charactersResponse.data); // 캐릭터 리스트 설정
        setTags(tagsResponse.data); // 태그 리스트 설정
        setFieldCategories(fieldsResponse.data); // 필드 리스트 설정
        setIsLoading(false); // 로딩 완료
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    console.log('Fetched Characters:', allCharacters);
  }, [allCharacters]);

  // 필터링된 결과 계산
  const fieldBasedCards = useMemo(() => {
    let filtered = [...allCharacters];
    if (fieldFilters.length > 0) {
      filtered = filtered.filter((char) =>
        fieldFilters.includes(char.field_idx)
      );
    }

    console.log('Field Filters:', fieldFilters); // [3] 필드 필터 값
    console.log('Filtered Characters (Field):', filtered); // [4] 필터링된 캐릭터 리스트
    return filtered.slice(0, fieldLimit);
  }, [allCharacters, fieldFilters, fieldLimit]);

  const tagBasedCards = useMemo(() => {
    let filtered = [...allCharacters];
    if (tagFilters.length > 0) {
      filtered = filtered.filter((char) =>
        char.tags?.some((tag) => tagFilters.includes(tag.tag_idx))
      );
    }
    return filtered.slice(0, tagLimit);
  }, [allCharacters, tagFilters, tagLimit]);

  const createdBasedCards = useMemo(() => {
    return [...allCharacters]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, createdLimit);
  }, [allCharacters, createdLimit]);

  // 이벤트 핸들러
  const handleFieldClick = (category) => {
    console.log('Clicked Category:', category); // 클릭한 카테고리 로그

    if (category.field_idx === -1) {
      setFieldFilters([]); // 초기화 버튼
      setFieldLimit(12);
      console.log('Field Filter Reset!');
    } else if (category.field_idx === 0) {
      setFieldLimit((prev) => prev + 12); // 더보기 버튼
      console.log('Field Limit Increased:', fieldLimit + 12);
    } else {
      // 필터 토글
      setFieldFilters((prev) => {
        const updatedFilters = prev.includes(category.field_idx)
          ? prev.filter((id) => id !== category.field_idx) // 필터 제거
          : [...prev, category.field_idx]; // 필터 추가
        console.log('Updated Field Filters:', updatedFilters); // 업데이트된 상태 출력
        return updatedFilters;
      });
    }
  };

  const handleTagClick = (category) => {
    if (category.tag_name === '초기화') {
      setTagFilters([]);
      setTagLimit(12);
    } else if (category.tag_name === '더보기') {
      setTagLimit((prev) => prev + 12);
    } else {
      // 선택/해제 토글
      setTagFilters(
        (prev) =>
          prev.includes(category.tag_name)
            ? prev.filter((tag) => tag !== category.tag_name) // 필터 제거
            : [...prev, category.tag_name] // 필터 추가
      );
    }
  };

  const handleCreatedClick = (category) => {
    if (category.field_idx === -1) {
      setCreatedLimit(12);
    } else if (category.field_idx === 0) {
      setCreatedLimit((prev) => prev + 12);
    }
  };

  const sectionData = [
    {
      title: '필드 기반 추천',
      categories: [
        ...fieldCategories.map((field) => ({
          name: field.field_category, // 필드 카테고리 이름
          field_idx: field.field_idx, // 필드 인덱스
        })),
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: fieldBasedCards,
      onCategoryClick: handleFieldClick,
      selectedCategories: fieldFilters,
      onCardClick: setSelectedCharacter,
    },
    {
      title: '태그 기반 추천',
      categories: [
        ...tags.map((tag) => ({
          name: tag.tag_name,
          field_idx: tag.tag_idx,
        })),
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: tagBasedCards,
      onCategoryClick: handleTagClick,
      selectedCategories: tagFilters,
      onCardClick: setSelectedCharacter,
    },
    {
      title: '새로 나온 캐릭터',
      categories: [
        { name: '더보기', field_idx: 0 },
        { name: '초기화', field_idx: -1 },
      ],
      cards: createdBasedCards,
      onCategoryClick: handleCreatedClick,
      selectedCategories: [],
      onCardClick: setSelectedCharacter,
    },
  ];

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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
          onCardClick={section.onCardClick}
        />
      ))}

      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default Section;
