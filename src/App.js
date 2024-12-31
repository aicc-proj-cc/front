import React, { useState } from 'react';
import ChatList from './components/ChatList'; // 채팅방 목록 컴포넌트
import ChatRoom from './components/ChatRoom'; // 채팅창 UI 컴포넌트
import CharacterManager from './components/CharacterManager'; // 캐릭터 생성 컴포넌트
import AITestPage from './components/AITestPage'; // AI 요청 테스트 페이지
import logo from './assets/logo.png'; // 로고 이미지 import
import './App.css';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null); // 현재 선택된 채팅방 ID
  const [selectedRoomName, setSelectedRoomName] = useState(''); // 현재 선택된 채팅방 이름 (캐릭터 이름)
  const [currentView, setCurrentView] = useState('chat'); // 현재 화면 상태: 'chat', 'character', 'ai-test'

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setSelectedRoomName('');
  };

  // 화면 렌더링 함수
  const renderView = () => {
    if (currentView === 'chat') {
      return (
        <div className="app-body">
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
      );
    } else if (currentView === 'character') {
      return <CharacterManager setCurrentView={setCurrentView} />;
    } else if (currentView === 'ai-test') {
      return <AITestPage />;
    }
  };

  return (
    <div className="app-container">
      {/* 상단 네비게이션 바 */}
      <div className="app-header">
        <h2
          className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentView('chat')}
        >
          채팅방
        </h2>
        <h2
          className={`nav-item ${currentView === 'character' ? 'active' : ''}`}
          onClick={() => setCurrentView('character')}
        >
          캐릭터 생성
        </h2>
        <h2
          className={`nav-item ${currentView === 'ai-test' ? 'active' : ''}`}
          onClick={() => setCurrentView('ai-test')}
        >
          AI 요청 테스트
        </h2>
      </div>

      {/* 현재 화면 렌더링 */}
      {renderView()}
    </div>
  );
}

export default App;
