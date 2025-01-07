import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatList.css';

// 채팅방 리스트(화면 좌측)
const ChatList = ({ onSelectRoom }) => {
  // 채팅방 상태 정의
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [selectedRoomId, setSelectedRoomId] = useState(''); // 선택된 채팅방 ID

  const user_id = 1 // -----------------------------------------임시 사용 유저-----------------------------------------

  // DB에서 채팅방 목록 불러오기
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat-room/user/${user_id}`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 불러오기 오류:', error);
    }
  };

  // 컴포넌트 로드 시 채팅방 목록 불러오기
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="chat-list">
      {/* 헤더 */}
      <div className="chat-list-header">채팅 내역</div>

      {/* 채팅방 목록 */}
      {chatRooms.map((room) => (
        <div
          key={room.room_id}
          className={`chat-item ${
            selectedRoomId === room.room_id ? 'selected' : ''
          }`}
          onClick={() => {
            // 선택된 채팅방 ID 상태 업데이트
            setSelectedRoomId(room.room_id);
            // 채팅방 선택 시 부모 컴포넌트로 선택된 방 정보 전달
            onSelectRoom(room.room_id, room.character_name);
          }}
        >
          <img src={room.character_image} alt="Character" className="avatar" />{' '}
          {/* 캐릭터 이미지 */}
          <div className="chat-item-content">
            <div className="character-name">{room.character_name}</div>{' '}
            {/* 캐릭터 이름 */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
