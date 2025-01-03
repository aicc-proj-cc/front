import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ChatRoom.css';
import userProfile from '../assets/user.png';
import { FiVolume2 } from 'react-icons/fi'; // 사운드 아이콘

const ChatRoom = ({ roomId, roomName, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // 챗봇이 타이핑 중인지 확인하는 상태
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
      setInput(''); // 입력 필드 초기화

      // 챗봇이 타이핑 중임을 나타냄
      setIsTyping(true);

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
    } finally {
      // 챗봇이 응답을 완료하면 타이핑 상태를 false로 변경
      setIsTyping(false);
    }
  };

  const playTTS = async (text) => {
    if (!roomInfo) return;

    try {
      // TTS API 호출
      const response = await axios.post(
        'http://localhost:8000/generate-tts/',
        {
          text: text,
          speaker: roomInfo.voice_speaker,
          language: 'KO', // 언어 고정
          speed: 1.0, // 속도 설정 (roomInfo에서 가져오거나 고정값)
        },
        {
          responseType: 'arraybuffer',
        }
      );

      // 반환된 데이터로 오디오 재생
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('TTS 호출 오류:', error.response?.data || error.message);
      alert('TTS 요청 중 오류가 발생했습니다.');
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
            <div className="character-status">
              <p>기분: {roomInfo.character_emotion || '알 수 없음'}</p>
              <p>호감도: {roomInfo.character_likes}</p>
            </div>
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
                      title="TTS 재생"
                    />
                  )}
                </div>
              </div>
              {isUser && (
                <img src={userProfile} alt="user" className="avatar" />
              )}
            </div>
          );
        })}

        {/* 챗봇이 타이핑 중일 때 표시 */}
        {isTyping && (
          <div className="message bot">
            <div className="bubble-container">
              <div className="bubble">
                {roomInfo && roomInfo.character_name && (
                  <div className="typing-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                )}
              </div>{' '}
              {/* 타이핑 중 표시 */}
            </div>
          </div>
        )}

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
