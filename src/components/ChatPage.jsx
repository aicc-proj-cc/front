import React, { useState } from 'react';
import ChatList from './ChatList'; // 채팅방 목록 컴포넌트
import ChatRoom from './ChatRoom'; // 채팅창 UI 컴포넌트
import logo from '../assets/logo.png'; // 로고 이미지 import
import './ChatPage.css';

function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(null); // 현재 선택된 채팅방 ID
  const [selectedRoomName, setSelectedRoomName] = useState(''); // 현재 선택된 채팅방 이름 (캐릭터 이름)

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setSelectedRoomName('');
  };

  return (
    <div className="chat-container">
      {/* 현재 화면 렌더링 */}
      <div className="chat-body">
          {/* 채팅방 목록 */}
          <div className="chat-list-container">
            <ChatList
              onSelectRoom={(roomId, roomName) => {
                setSelectedRoom(roomId); // 선택된 채팅방 ID 저장
                setSelectedRoomName(roomName); // 선택된 채팅방 이름 저장
              }}
            />
          </div>

          {/* 채팅방 UI */}
          <div className="chat-room-container">
            {selectedRoom ? (
              <ChatRoom
                roomId={selectedRoom}
                roomName={selectedRoomName}
                onLeaveRoom={handleLeaveRoom}
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