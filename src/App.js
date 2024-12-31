import React, { useState } from 'react';
import ChatPage from './components/ChatPage'; // 채팅방 목록 컴포넌트
import './App.css';

function App() {
  return (
    <div className="chat-container">
      <ChatPage />
    </div>
  );
}

export default App;