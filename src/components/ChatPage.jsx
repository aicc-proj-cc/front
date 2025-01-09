import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import ChatRoom from './ChatRoom'; // 채팅창 UI 컴포넌트
import axios from 'axios';
import logo from '../assets/logo.png'; // 로고 이미지 import
import './ChatPage.css';
import { getUserIdxFromToken } from './main/utils/authUtils';

function ChatPage() {
  const { chatRoomId } = useParams(); // URL에서 chatRoomId 가져오기
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [selectedRoomId, setSelectedRoomId] = useState(''); // 선택된 채팅방 ID
  const [selectedRoomName, setSelectedRoomName] = useState(''); // 선택된 채팅방 이름
  const [selectedRoomImg, setSelectedRoomImg] = useState(''); // 선택된 채팅방 이미지
  const isFetched = useRef(false);

  const user_idx = getUserIdxFromToken(); // 함수 호출

  // 채팅방 목록 가져오기
  const fetchRooms = async () => {
    if (!user_idx) {
      toast.error('로그인이 필요합니다')
      navigate('/signin')
      return
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/chat-room/user/${user_idx}`
      );
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 불러오기 오류:', error);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchRooms();
      isFetched.current = true; // 한 번만 실행되도록 설정
    }
  }, [user_idx]);

  useEffect(() => {
    if (chatRoomId) {
      const room = chatRooms.find((room) => room.room_id === chatRoomId);
      if (room) {
        setSelectedRoomId(room.room_id);
        setSelectedRoomName(room.character_name);
        setSelectedRoomImg(room.character_image);
      }
    } else {
      setSelectedRoomId('');
      setSelectedRoomName('');
      setSelectedRoomImg('');
    }
  }, [chatRoomId, chatRooms]);

  return (
    <div className="chat-container">
      <div className="chat-body">
        {/* 채팅방 목록 */}
        <div className="chat-list-container">
          <div className="chat-list-header">채팅 내역</div>
          <div className="chat-list">
            {chatRooms.map((room) => (
              <div
                key={room.room_id}
                className={`chat-item ${
                  selectedRoomId === room.room_id ? 'selected' : ''
                }`}
                onClick={() => {
                  navigate(`/ChatPage/${room.room_id}`); // URL 변경
                }}
              >
                <img
                  src={room.character_image}
                  alt="Character"
                  className="avatar"
                />
                <div className="chat-item-content">
                  <div className="character-name">{room.character_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅방 UI */}
        <div className="chat-room-container">
          {chatRoomId ? (
            <ChatRoom
              roomId={chatRoomId}
              roomName={selectedRoomName}
              roomImg={selectedRoomImg}
              onLeaveRoom={() => navigate('/ChatPage')}
            />
          ) : (
            <div className="logo-container">
              <img src={logo} alt="Logo" className="main-logo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
