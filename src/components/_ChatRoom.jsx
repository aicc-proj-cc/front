import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ChatRoom.css';
import userProfile from '../assets/user.png';
import { FiVolume2 } from 'react-icons/fi'; // 사운드 아이콘 라이브러리

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
      setMessages(response.data);
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
      console.log("response.data :", response.data);

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

      setMessages((prev) => [...prev, userMessage]);
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

        setMessages((prev) => [...prev, botMessage]);
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

  const playTTS = async (text) => {
    if (!roomInfo) return;

    try {
      // TTS 서버 호출
      const response = await axios.post(
        'http://localhost:8000/generate-tts/',
        {
          text: text,
          speaker: roomInfo.voice_speaker,
          language: 'KO', // 언어 고정 (예: 한국어)
          speed: 1.0, // 원하는 속도, roomInfo에서 가져와도 됨
        },
        {
          responseType: 'arraybuffer',
        }
      );

      // Blob 생성 및 재생
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('TTS 생성 오류:', error.response?.data || error.message);
      alert('TTS 생성 중 오류가 발생했습니다.');
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
              <p>캐릭터 이름: {roomInfo.character_name}</p>
              <p>기분: {roomInfo.character_emotion || '알 수 없음'}</p>
              <p>호감도: {roomInfo.character_likes}</p>
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
              {!isUser && <img src={userProfile} alt="bot" className="avatar" />}
              <div className="bubble-container">
                <div className="bubble">{msg.content}</div>
                <div className="timestamp-container">
                  <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {!isUser && (
                    <FiVolume2
                      className="sound-icon"
                      onClick={() => playTTS(msg.content)}
                      title="메시지 읽기"
                    />
                  )}
                </div>
              </div>
              {isUser && <img src={userProfile} alt="user" className="avatar" />}
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
