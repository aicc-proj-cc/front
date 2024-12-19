import React, { useState } from "react";
import ChatList from "./components/ChatList"; // 채팅방 목록 컴포넌트
import ChatRoom from "./components/ChatRoom"; // 채팅창 UI 컴포넌트
import CharacterManager from "./components/CharacterManager"; // 캐릭터 생성 컴포넌트
import "./App.css";

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null); // 현재 선택된 채팅방 ID
  const [selectedRoomName, setSelectedRoomName] = useState(""); // 현재 선택된 채팅방 이름 (캐릭터 이름)
  const [currentView, setCurrentView] = useState("chat"); // 현재 화면 상태: 'chat' 또는 'character'

  // 화면 렌더링 함수
  const renderView = () => {
    if (currentView === "chat") {
      return (
        <div className="app-body">
          {/* 채팅방 목록 */}
          <div className="chat-list-container">
            <ChatList
              onSelectRoom={(roomId, roomName) => {
                // 채팅방이 선택되었을 때 호출
                setSelectedRoom(roomId); // 선택된 채팅방 ID 저장
                setSelectedRoomName(roomName); // 선택된 채팅방 이름 저장
              }}
            />
          </div>

          {/* 채팅방 UI */}
          <div className="chat-room-container">
            {selectedRoom ? (
              // 채팅방이 선택된 경우
              <ChatRoom roomId={selectedRoom} roomName={selectedRoomName} />
            ) : (
              // 채팅방이 선택되지 않은 경우(처음 접속)
              <div className="chat-placeholder">채팅방을 선택하세요</div>
            )}
          </div>
        </div>
      );
    } 
    // 캐릭터 생성 화면 렌더링
    else if (currentView === "character") {
      return <CharacterManager />; // 캐릭터 생성 화면
    }
  };

  return (
    <div className="app-container">
      {/* 상단 네비게이션 바 */}
      <div className="app-header">
        {/* 채팅방 네비게이션 버튼 */}
        <h2
          className={`nav-item ${currentView === "chat" ? "active" : ""}`}
          onClick={() => setCurrentView("chat")}
        >
          채팅방
        </h2>
        <h2
          className={`nav-item ${currentView === "character" ? "active" : ""}`}
          onClick={() => setCurrentView("character")}
        >
          캐릭터 생성
        </h2>
      </div>

      {/* 현재 화면 렌더링 */}
      {renderView()}
    </div>
  );
}

export default App;
