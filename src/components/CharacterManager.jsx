import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CharacterManager.css";

// 캐릭터 생성&삭제 페이지
const CharacterManager = () => {
  // 캐릭터 관리 페이지에서 사용할 상태 정의
  const [characters, setCharacters] = useState([]); // 캐릭터 목록
  const [characterName, setCharacterName] = useState(""); // 캐릭터 이름
  const [characterImage, setCharacterImage] = useState(""); // 프로필 사진
  const [characterField, setCharacterField] = useState(""); // 캐릭터 필드
  const [characterStatusMessages, setCharacterStatusMessages] = useState(["", "", ""]); // 상태 메시지 리스트
  const [characterLikes, setCharacterLikes] = useState(""); // 캐릭터 기본 호감도
  const [characterPrompt, setCharacterPrompt] = useState(""); // 캐릭터 프롬프트
  const [characterDescription, setCharacterDescription] = useState(""); // 캐릭터 소개

  // DB 에서 캐릭터 목록 불러오기
  // 반환 정보 : [캐릭터1, 캐릭터2, ...]
  // 각 캐릭터 내부 정보 : {생성일, 설명, 필드, ID, 좋아요 수, 이름, 기본 호감도, 프롬프트, 상태메시지, 숨김여부}
  const fetchCharacters = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/characters/");
      setCharacters(response.data);
    } catch (error) {
      console.error("캐릭터 목록 불러오기 오류:", error);
    }
  };

  // 새로운 캐릭터를 DB에 저장하는 함수
  const saveCharacter = async () => {
    // 빈 입력칸 확인
    if (!characterName.trim() || !characterImage.trim() || !characterField.trim() || !characterLikes.trim() || !characterPrompt.trim() || !characterDescription.trim()){
      console.error("필수 입력값을 모두 입력해주세요.");
      return;
    }

    // 상태 메시지 배열 필터링 (빈 값 제거)
    const filteredMessages = characterStatusMessages.filter((msg) => msg.trim() !== "");

    if (filteredMessages.length === 0) {
      console.error("상태 메시지를 입력해주세요.");
      return;
    }

    // 호감도 숫자 검증
    const likes = parseInt(characterLikes, 10); // 문자열을 정수로 변환
    if (isNaN(likes)) {
      console.error("호감도는 숫자 형식으로 입력해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/characters/", {
        character_name: characterName,
        character_image: characterImage,
        character_field: characterField,
        character_likes: likes,
        character_status_message: filteredMessages, // 상태 메시지 리스트
        character_prompt: characterPrompt,
        character_description: characterDescription,
      });
      fetchCharacters(); // 저장 후 캐릭터 목록 갱신 (새로고침)
      setCharacterName("");
      setCharacterImage("");
      setCharacterField("");
      setCharacterLikes("");
      setCharacterStatusMessages(["", "", ""]); // 상태 메시지 초기화
      setCharacterPrompt("");
      setCharacterDescription("");
    } catch (error) {
      console.error("캐릭터 저장 오류:", error);
    }
  };

  // 상태 메시지 입력 핸들러
  const handleStatusMessageChange = (index, value) => {
    const updatedMessages = [...characterStatusMessages];
    updatedMessages[index] = value;
    setCharacterStatusMessages(updatedMessages);
  };

  // 캐릭터 삭제 함수
  const deleteCharacter = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/characters/${id}`);
      fetchCharacters(); // 캐릭터 삭제 후 목록 갱신
    } catch (error) {
      console.error("캐릭터 삭제 오류:", error);
    }
  };


  // 컴포넌트 로드 시 캐릭터 목록을 한 번 불러옴
  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="character-manager">
      <h1>캐릭터 관리</h1>
      
      {/* 캐릭터 정보 입력 폼 */}
      <div className="character-form">
        <label>이름</label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="캐릭터 이름 입력"
        />

        <label>캐릭터 필드</label>
        <input
          type="text"
          value={characterField}
          onChange={(e) => setCharacterField(e.target.value)}
          placeholder="캐릭터 필드 입력"
        />

        <label>캐릭터 이미지</label>
        <input
          type="text"
          value={characterImage}
          onChange={(e) => setCharacterImage(e.target.value)}
          placeholder="캐릭터 이미지 URL 입력"
        />

        {/* 상태 메시지 리스트 */}
        <label>캐릭터 상태 메시지</label>
        {characterStatusMessages.map((msg, index) => (
          <input
            key={index}
            type="text"
            value={msg}
            onChange={(e) => handleStatusMessageChange(index, e.target.value)}
            placeholder={`상태 메시지 ${index + 1}`}
          />
        ))}

        <label>캐릭터 호감도</label>
        <input
          type="number" // HTML5 숫자 입력 필드
          value={characterLikes}
          onChange={(e) => setCharacterLikes(e.target.value)}
          placeholder="캐릭터 기본 호감도 입력"
        ></input>

        <label>캐릭터 프롬프트</label>
        <textarea
          value={characterPrompt}
          onChange={(e) => setCharacterPrompt(e.target.value)}
          placeholder="캐릭터 프롬프트 입력"
          rows="2"
        ></textarea>

        <label>캐릭터 소개</label>
        <textarea
          value={characterDescription}
          onChange={(e) => setCharacterDescription(e.target.value)}
          placeholder="캐릭터 소개 입력"
          rows="4"
        ></textarea>

        <button onClick={saveCharacter}>저장</button>
      </div>

      {/* 캐릭터 목록 테이블 */}
      <table className="character-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이미지</th>
            <th>이름</th>
            <th>소개</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((char) => (
            <tr key={char.character_index}>
              <td>{char.character_index}</td>
              <td>
                <img
                  src={char?.character_image || "../assets/default-bot.png"} // 캐릭터 프로필 동적 로드
                  alt="bot"
                  className="avatar"
                />
              </td>
              <td>{char.character_name}</td>
              <td>{char.character_description}</td>
              <td>
                <button onClick={() => deleteCharacter(char.character_index)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharacterManager;
