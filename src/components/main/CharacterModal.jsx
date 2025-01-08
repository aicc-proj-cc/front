import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CharacterModal.css';

const CharacterModal = ({ character, onClose }) => {
  const navigate = useNavigate();
  const user_id = 1; // 임시 사용자 ID

  // 상태 관리
  const [userName, setUserName] = useState('');
  const [userIntroduction, setUserIntroduction] = useState('');

  const handleStartChat = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/chat-room/',
        {
          user_idx: user_id,
          character_id: character.char_idx,
          user_unique_name: userName,
          user_introduction: userIntroduction,
        }
      );
      navigate('/ChatPage');
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
    }
  };

  return (
    <div className="character-modal__overlay" onClick={onClose}>
      <div
        className="character-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="character-modal__close-btn" onClick={onClose}>
          ×
        </button>

        <div className="character-modal__header">
          <h2>캐릭터 정보</h2>
        </div>

        <div className="character-modal__body">
          <img
            src={character.character_image || '/default-avatar.png'}
            alt={character.char_name}
            className="character-modal__image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />

          <div className="character-modal__info">
            <h2 className="character-modal__name">{character.char_name}</h2>

            {character.tags && character.tags.length > 0 && (
              <div className="character-modal__tags">
                {character.tags.map((tag, index) => (
                  <span key={index} className="character-modal__tag">
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            )}

            <p className="character-modal__description">
              {character.char_description}
            </p>
          </div>

          <div className="character-modal__user-input">
            <label htmlFor="userName">호칭:</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="캐릭터가 부를 사용자 호칭을 입력하세요"
            />

            <label htmlFor="userIntroduction">자기소개:</label>
            <textarea
              id="userIntroduction"
              value={userIntroduction}
              onChange={(e) => setUserIntroduction(e.target.value)}
              placeholder="간단한 자기소개를 입력하세요"
            />
          </div>

          <div className="character-modal__footer">
            <button
              className="character-modal__chat-btn"
              onClick={handleStartChat}
            >
              대화하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
