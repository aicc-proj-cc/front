import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatList.css";

const ChatList = ({ onSelectRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  // const [newRoomName, setNewRoomName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterImage, setCharacterImage] = useState("");
  const [characterStatusMessage, setCharacterStatusMessage] = useState("");
  const [characterPrompt, setCharacterPrompt] = useState("");

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/chat-room/");
      setChatRooms(response.data);
      console.log("response.data", response.data)
    } catch (error) {
      console.error("채팅방 목록 불러오기 오류:", error);
    }
  };

  const createRoom = async () => {
    if (!characterName || !characterImage || !characterPrompt) return;
    try {
      await axios.post("http://localhost:8000/api/chat-room/", {
        // name: newRoomName,
        character_name: characterName,
        character_image: characterImage,
        character_status_message: characterStatusMessage,
        character_prompt: characterPrompt, // 프롬프트 추가
      });
      fetchRooms();
      // setNewRoomName("");
      setCharacterName("");
      setCharacterImage("");
      setCharacterStatusMessage("");
      setCharacterPrompt("");
    } catch (error) {
      console.error("채팅방 생성 오류:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="chat-list">
      <div className="chat-list-header">채팅 내역</div>
      {chatRooms.map((room) => (
        <div
          key={room.id}
          className="chat-item"
          onClick={() => onSelectRoom(room.id, room.character_name)}
        >
          <img src={room.character_image} alt="Character" className="avatar" />
          <div className="chat-item-content">
            <div className="character-name">{room.character_name}</div>
            <div className="character-status-message">{room.character_status_message}</div>
          </div>
        </div>
      ))}
      <div className="create-room">
        {/* <input
          type="text"
          placeholder="채팅방 이름"
          value={characterName}
          onChange={(e) => setNewRoomName(e.target.value)}
        /> */}
        <input
          type="text"
          placeholder="캐릭터 이름"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
        <input
          type="text"
          placeholder="캐릭터 상태 메세지"
          value={characterStatusMessage}
          onChange={(e) => setCharacterStatusMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="캐릭터 이미지 URL"
          value={characterImage}
          onChange={(e) => setCharacterImage(e.target.value)}
        />
        <textarea
          placeholder="캐릭터 프롬프트 입력"
          value={characterPrompt}
          onChange={(e) => setCharacterPrompt(e.target.value)}
          rows="5"
        ></textarea>
        <button onClick={createRoom}>생성</button>
      </div>
    </div>
  );
};

export default ChatList;
