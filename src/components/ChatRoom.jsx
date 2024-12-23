import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatRoom.css";
import userProfile from "../assets/user.png";

const ChatRoom = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [input, setInput] = useState(""); // 메시지 입력 필드의 상태
  const [roomInfo, setRoomInfo] = useState(null); // 채팅방 정보

  // 채팅 메시지 가져오기
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("메시지 가져오기 오류:", error.response?.data || error.message);
    }
  };

  // 채팅방 정보 가져오기
  const fetchRoomInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat-room-info/${roomId}`);
      setRoomInfo(response.data);
    } catch (error) {
      console.error("채팅방 정보 가져오기 오류:", error.response?.data || error.message);
    }
  };

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (!input.trim() || !roomInfo) return;

    try {
      const response = await axios.post(`http://localhost:8000/api/chat/${roomId}`, {
        sender: "user", // 유저가 전송 명시
        content: input, // 메시지 내용
      });

      setMessages((prev) => [
        ...prev,
        { sender: "user", content: input, timestamp: new Date().toISOString() },
        { sender: "bot", content: response.data.bot, timestamp: new Date().toISOString() },
      ]);
      setInput("");
      fetchRoomInfo(); // 메시지 전송 후 채팅방 정보 업데이트
    } catch (error) {
      console.error("메시지 전송 오류:", error.response?.data || error.message);
    }
  };

  // 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    fetchMessages(); // 이전 메시지
    fetchRoomInfo(); // 채팅방 정보
  }, [roomId]);

  return (
    <div className="chat-room">
      {/* 채팅창 헤더 */}
      <div className="chat-header">
        <p>'{roomName}' 와의 채팅방</p> {/* 채팅방 이름 */}
        {roomInfo ? (
          <>
            <p>캐릭터 이름: {roomInfo.character_name}</p>
            <p>기분: {roomInfo.character_emotion || "알 수 없음"}</p> {/* 캐릭터의 현재 기분 */}
            <p>호감도: {roomInfo.character_likes}</p> {/* 캐릭터의 호감도 */}
          </>
        ) : (
          <p>채팅방 정보를 불러오는 중...</p>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user"; // 메시지 전송자 판단
          return (
            <div key={idx} className={`message ${isUser ? "user" : "bot"}`}>
              <div className="bubble-container">
                <div className="bubble">{msg.content}</div>
                <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {isUser && <img src={userProfile} alt="user" className="avatar" />}
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
