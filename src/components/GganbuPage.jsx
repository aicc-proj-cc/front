import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GganbuPage.css';

const GganbuPage = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedCharacters = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const verifyResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userId = verifyResponse.data.user_idx;
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/api/characters/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCharacters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('팔로우한 캐릭터 불러오기 실패:', error);
        setLoading(false);
      }
    };

    fetchFollowedCharacters();
  }, []);

  return (
    <div className="gganbu-container">
      <div className="gganbu-content">
        <div className="gganbu-main">
          <h1>내 캐릭터</h1>

          <div className="characters-row">
            {/* 캐릭터 만들기 버튼 */}
            <div
              className="create-character-card-horizontal"
              onClick={() => navigate('/CharacterManager')}
            >
              <div className="plus-box">
                <span>+</span>
              </div>
              <div className="create-info">
                <h3 className="create-title">캐릭터 만들기</h3>
                <p className="create-subtitle">나만의 캐릭터를 만들어보세요!</p>
              </div>
            </div>

            {/* 캐릭터 카드들 */}
            {characters.map((character) => (
              <div
                key={character.char_idx}
                className="character-card-horizontal"
              >
                <img
                  src={character.character_image || '/default-avatar.png'}
                  alt={character.char_name}
                  className="character-image-horizontal"
                />
                <div className="character-info-horizontal">
                  <h3>{character.char_name}</h3>
                  <p>{character.char_description}</p>
                  <div className="character-stats-horizontal">
                    <span>팔로워 {character.followers_count || 0}</span>
                    <span>좋아요 {character.likes_count || 0}</span>
                    <span>댓글 {character.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GganbuPage;
