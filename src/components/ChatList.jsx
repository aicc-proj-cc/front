import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatList.css";

// 채팅방 리스트(화면 좌측)
const ChatList = ({ onSelectRoom }) => {
  // 채팅방 상태 정의
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [characterIdx, setCharacterIdx] = useState(null); // 선택한 캐릭터 ID

  // DB 에서 채팅방 목록 불러오기
  // 반환 정보 : [채팅방1, 채팅방2, ...]
  // 각 채팅방 내부 정보 : {채팅방id, 캐릭터이미지, 캐릭터이름, 캐릭터프롬프트, 캐릭터상태메시지, 생성일}
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/chat-room/");
      setChatRooms(response.data);
    } catch (error) {
      console.error("채팅방 목록 불러오기 오류:", error);
    }
  };

  // 새로운 채팅방 생성
  const createRoom = async () => {
    if (!characterIdx) {
        console.error("해당하는 캐릭터 ID가 없습니다.");
        return; // 캐릭터 ID가 없으면 함수 종료
      }

    try {
      await axios.post("http://localhost:8000/api/chat-room/", {
        character_id: characterIdx, // 캐릭터 id
      });
      fetchRooms();
      setCharacterIdx("");
    } catch (error) {
      console.error("채팅방 생성 오류:", error.response?.data || error.message);
    }
  };

  // 컴포넌트 로드 시 채팅방 목록 불러오기
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="chat-list">
      {/* 헤더 */}
      <div className="chat-list-header">채팅 내역</div>

      {/* 채팅방 목록 */}
      {chatRooms.map((room) => (
        <div
          key={room.room_id}
          className="chat-item"
          onClick={() => {
            // 채팅방 선택 시 부모 컴포넌트로 선택된 방 정보 전달
            onSelectRoom(room.room_id, room.character_name);
          }
          }
        >
          <img src={room.character_image} alt="Character" className="avatar" /> {/* 캐릭터 이미지 */}
          <div className="chat-item-content">
            <div className="character-name">{room.character_name}</div> {/* 캐릭터 이름 */}
            <div className="character-status-message">{room.character_status_message}</div> {/* 캐릭터 상태 메시지 */}
          </div>
        </div>
      ))}

      {/* 채팅방 생성 폼 */}
      <div className="create-room">
        <input
          type="number" // 숫자만 입력 가능하도록 타입 설정
          placeholder="캐릭터 번호"
          value={characterIdx}
          onChange={(e) => {
            const value = e.target.value;
            setCharacterIdx(value ? parseInt(value, 10) : null);
          }}
        />
        <button onClick={createRoom}>생성</button> {/* 채팅방 생성 버튼 */}
      </div>
    </div>
  );
};

export default ChatList;
