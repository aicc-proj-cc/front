import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatRoom.css";
import userProfile from "../assets/user.png";

// 캐릭터와 채팅하는 페이지(화면 우측)
const ChatRoom = ({ roomId, roomName }) => {
  // 채팅창 상태 정의
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [input, setInput] = useState(""); // 메시지 입력 필드의 상태
  const [character, setCharacter] = useState(null); // 현재 채팅방의 캐릭터 정보

  // 채팅 메시지 가져오기
  // [채팅기록01, 채팅기록02, ...]
  // 채팅기록 내부 : {송신자, 채팅내용, 전송날짜}
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("메시지 가져오기 오류:", error.response?.data || error.message);
    }
  };

  // 채팅방의 캐릭터 정보 가져오기
  // {캐릭터 이름, 이미지, 프롬프트, 상태메시지}
  const fetchCharacter = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat-room/${roomId}/character`);
      setCharacter(response.data);
    } catch (error) {
      console.error("캐릭터 정보 가져오기 오류:", error.response?.data || error.message);
    }
  };

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 입력 값이 비어있거나 캐릭터 정보가 없으면 함수 종료
    if (!input.trim() || !character) return;
    try {
      const response = await axios.post(`http://localhost:8000/api/chat/${roomId}/${character.character_name}`, {
        sender: "user", // 유저가 전송 명시
        content: input, // 메시지 내용
      });

      // 새로운 메시지를 기존 메시지 상태에 추가
      setMessages((prev) => [
        ...prev,
        { sender: "user", content: input, timestamp: new Date().toISOString() },
        { sender: "bot", content: response.data.bot, timestamp: new Date().toISOString() },
      ]);
      setInput("");
    } catch (error) {
      console.error("메시지 전송 오류:", error.response?.data || error.message);
    }
  };

  // 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    fetchMessages(); // 이전 메시지
    fetchCharacter(); // 캐릭터 정보 
  }, [roomId]); // roomId(채팅방)가 변경될 때마다 실행

  return (
    <div className="chat-room">
      {/* 채팅창 헤더 */}
      <div className="chat-header">
        <p>'{roomName}' 와의 채팅방</p> {/* 채팅방 이름 */}
        <p>{character?.character_prompt || "프롬프트 불러오기 실패"}</p> {/* 캐릭터 프롬프트 */}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user"; // 메시지 전송자 판단
          return (
            <div key={idx} className={`message ${isUser ? "user" : "bot"}`}> {/* 사용자 또는 캐릭터 메시지 스타일 적용 */}
              {!isUser && (
                <img
                  src={character?.character_image || "../assets/default-bot.png"} // 캐릭터 프로필 동적 로드
                  alt="bot"
                  className="avatar"
                />
              )}
              <div className="bubble-container">
                <div className="bubble">{msg.content}</div> {/* 메시지 내용 표시 */}
                <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {/* 메시지 시간 표시 */}
                </div>
              </div>
              {isUser && <img src={userProfile} alt="user" className="avatar" />} {/* 사용자 프로필 이미지 */}
            </div>
          );
        })}
      </div>

      {/* 메시지 입력창 */}
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
