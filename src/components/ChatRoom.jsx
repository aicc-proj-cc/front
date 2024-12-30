import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ChatRoom.css';
import userProfile from '../assets/user.png';

const ChatRoom = ({ roomId, roomName, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat/${roomId}`
      );
      // 타임스탬프로 정렬
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error(
        '메시지 가져오기 오류:',
        error.response?.data || error.message
      );
    }
  };

  const fetchRoomInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat-room-info/${roomId}`
      );
      setRoomInfo(response.data);
    } catch (error) {
      console.error(
        '채팅방 정보 가져오기 오류:',
        error.response?.data || error.message
      );
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomInfo) return;

    try {
      const userMessage = {
        sender: 'user',
        content: input,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) =>
        [...prev, userMessage].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );
      setInput('');

      const response = await axios.post(
        `http://localhost:8000/api/chat/${roomId}`,
        {
          sender: 'user',
          content: input,
        }
      );

      if (response.data && response.data.bot) {
        const botMessage = {
          sender: roomInfo.character_name,
          content: response.data.bot,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) =>
          [...prev, botMessage].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
        await fetchRoomInfo();
      }
    } catch (error) {
      console.error(
        '메시지 전송 오류:',
        error.response?.data?.detail || error.message
      );
      alert('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
      fetchRoomInfo();
    }
  }, [roomId]);

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button className="back-button" onClick={onLeaveRoom}>
          &lt;
        </button>
        <div className="header-content">
          <p>'{roomName}' 와의 채팅방</p>
          {roomInfo ? (
            <>
              <div className="character-status">
                <p>기분: {roomInfo.character_emotion || '알 수 없음'}</p>
                <p>호감도: {roomInfo.character_likes}</p>
              </div>
            </>
          ) : (
            <p>채팅방 정보를 불러오는 중...</p>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={idx} className={`message ${isUser ? 'user' : 'bot'}`}>
              {!isUser && (
                <img src={userProfile} alt="bot" className="avatar" />
              )}
              <div className="bubble-container">
                <div className="bubble">{msg.content}</div>
                <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              {isUser && (
                <img src={userProfile} alt="user" className="avatar" />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatRoom;
