import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CharacterModal.css';

const CharacterModal = ({ character, onClose }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userIntroduction, setUserIntroduction] = useState('');
  const user_id = 1; // 임시 사용자 ID

  console.log('캐릭터 데이터:', character);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/friends/check/${user_id}/${character.char_idx}`
        );
        setIsFollowing(response.data.is_following);
      } catch (error) {
        console.error('팔로우 상태 확인 실패:', error);
      }
    };

    checkFollowStatus();
  }, [character.char_idx]);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await axios.delete(
          `http://localhost:8000/api/friends/unfollow/${user_id}/${character.char_idx}`
        );
      } else {
        await axios.post('http://localhost:8000/api/friends/follow', {
          user_idx: user_id,
          char_idx: character.char_idx,
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('팔로우 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="character-modal__image-container">
            <img
              src={character.character_image || '/default-avatar.png'}
              alt={character.char_name}
              className="character-modal__image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <button
              className={`follow-button ${isFollowing ? 'following' : ''} ${
                isLoading ? 'loading' : ''
              }`}
              onClick={handleFollowToggle}
              disabled={isLoading}
            >
              {isFollowing ? '팔로잉' : '+ 팔로우'}
            </button>
          </div>

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
