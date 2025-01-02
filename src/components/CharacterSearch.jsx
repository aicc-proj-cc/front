import React, { useState } from 'react';
import axios from 'axios';
import './CharacterSearch.css'; // 스타일 추가

const CharacterSearch = () => {
  // 상태 변수 선언
  const [query, setQuery] = useState(''); // 검색어
  const [characters, setCharacters] = useState([]); // 검색된 캐릭터 목록
  const [error, setError] = useState(null); // 에러 처리

  // 검색어가 변경될 때마다 호출되는 함수
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // 검색 API 호출 함수
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/characters/search?query=${query}`
      );
      setCharacters(response.data); // 검색된 캐릭터 목록 설정
      setError(null); // 에러 초기화
    } catch (err) {
      setError('검색 결과가 없습니다.'); // 에러 처리
      setCharacters([]); // 이전 결과 초기화
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // 엔터키를 눌렀을 때 검색 실행
    }
  };

  return (
    <div className="character-search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="캐릭터 검색"
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // 엔터키 이벤트 처리
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>

      {/* 검색 결과 표시 */}
      <div className="search-results">
        {error && <p className="error-message">{error}</p>}
        {characters.length > 0 && (
          <ul>
            {characters.map((char) => (
              <li key={char.id} className="character-item">
                <h3>{char.name}</h3>
                <p>{char.description}</p>
              </li>
            ))}
          </ul>
        )}
        {characters.length === 0 && !error && <p>검색 결과가 없습니다.</p>}
      </div>
    </div>
  );
};

export default CharacterSearch;
