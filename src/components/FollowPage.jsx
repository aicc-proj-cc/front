import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterModal from '../components/main/CharacterModal';
import './FollowPage.css';

const FollowPage = () => {
  const navigate = useNavigate();
  const [followedCharacters, setFollowedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFollowedCharacters = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          navigate('/signin');
          return;
        }
        const userIdx = JSON.parse(atob(token.split('.')[1])).user_idx;
        const response = await axios.get(
          `http://localhost:8000/api/friends/${userIdx}/characters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowedCharacters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('팔로우한 캐릭터 불러오기 실패:', error);
        setLoading(false);
      }
    };

    fetchFollowedCharacters();
  }, [navigate]);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="follow-container">
      <div className="follow-content">
        <div className="follow-main">
          <h1>내가 팔로우한 캐릭터</h1>
          {loading ? (
            <p>로딩 중...</p>
          ) : followedCharacters.length === 0 ? (
            <p>팔로우한 캐릭터가 없습니다.</p>
          ) : (
            <div className="follow-characters-row">
              {followedCharacters.map((character) => (
                <div
                  key={character.char_idx}
                  className="follow-character-card-horizontal"
                  onClick={() => handleCharacterClick(character)}
                >
                  <img
                    src={character.character_image || '/default-avatar.png'}
                    alt={character.char_name}
                    className="follow-character-image-horizontal"
                  />
                  <div className="follow-character-info-horizontal">
                    <h3>{character.char_name}</h3>
                    <p>{character.char_description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FollowPage;
