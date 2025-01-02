import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './CharacterManager.css';

const CharacterManager = ({ setCurrentView }) => {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('profile');

  // 프로필 탭 상태
  const [characterName, setCharacterName] = useState('');
  const [characterField, setCharacterField] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterImage, setCharacterImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 상세 설정 탭 상태
  const [characterAppearance, setCharacterAppearance] = useState('');
  const [characterPersonality, setCharacterPersonality] = useState('');
  const [characterBackground, setCharacterBackground] = useState('');
  const [characterSpeechStyle, setCharacterSpeechStyle] = useState('');
  const [characterLikes, setCharacterLikes] = useState('');
  const [characterStatusMessages, setCharacterStatusMessages] = useState([
    '',
    '',
    '',
  ]);
  const [exampleDialogues, setExampleDialogues] = useState([
    { userMessage: '', characterResponse: '' },
  ]);

  const [selectedVoice, setSelectedVoice] = useState('paimon');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const voiceOptions = [
    { name: 'Paimon', value: 'paimon' },
    { name: 'Ganyu', value: 'ganyu' },
  ];

  // 캐릭터 목록 관리
  const [characters, setCharacters] = useState([]);

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCharacterImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setCharacterImage(null);
    setPreviewImage(null);
  };

  const navigate = useNavigate();

  // 하드코딩된 작성 예시 데이터
  const examplePrompts = {
    profile: {
      name: '이예린',
      description:
        '이예린은 좀비 바이러스 창궐 이후 가족을 모두 잃고 혼자 살아남은 젊은 여성입니다. 그녀는 당신을 구출하여 자신의 은신처로 데려가지만, 그녀 또한 생존을 위해 때로는 잔인한 선택을 해야합니다. 당신은 이예린과 함께 더 나은 미래를 찾아 나설 것인지, 아니면 그녀를 떠나 혼자 살아남을지 결정해야 합니다.',
      field: '액션/공포',
    },
    details: {
      appearance:
        '이예린은 갈색의 긴 머리와 날카로운 눈매를 가진 젊은 여성입니다. 그녀는 강인한 인상을 주지만, 그 안에는 상처받은 마음이 숨겨져 있습니다. 평소에는 간편한 생존복을 입고 다니며, 필요할 때는 무기를 능숙하게 다루는 모습이 인상적입니다.',
      personality:
        '이예린은 극한 상황에서도 자신의 감정과 인간성을 유지하려는 이중적인 모습을 보여줍니다. 그녀는 외면적으로 강하고 냉철해 보이지만, 내면에는 자신과 타인에 대한 깊은 연민과 갈등이 존재합니다.',
      background:
        '이예린은 좀비로부터 오는 긴장과 두려움속에 지내고 있습니다. 이예린의 주된 목표는 좀비로부터 안전한 은신처를 찾는 것입니다. 그녀는 더 나은 미래를 꿈꾸지만, 그 과정에서 자신이 선택해야 하는 잔인한 결정들에 괴로워합니다.',
      speechStyle:
        '이예린의 말투는 그녀의 성격과 상황에 따라 다채롭게 변할 수 있습니다. 전반적으로 조심스럽고 긴장된 어조를 사용하지만, 내면의 갈등이나 감정을 드러낼 때는 부드럽고 솔직한 면모를 보여줍니다.',
      statusMessages: ['...', '....', '.....'],
      exampleDialogues: [
        {
          userMessage: '이곳에 계속 있을 수 있을까..?',
          characterResponse:
            '이곳은 안전해 보이지만, 언제까지 버틸 수 있을지 모르겠어. 너는 어떻게 생각해?',
        },
        {
          userMessage: '정말 이 선택이 맞는 선택일까?',
          characterResponse:
            '이 선택이 옳은지 모르겠어. 하지만 생존이 최우선이야. 너도 나와 함께 이 길을 가겠어?',
        },
      ],
    },
  };

  // DB에서 캐릭터 목록 불러오기
  const fetchCharacters = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/characters/');
      setCharacters(response.data);
    } catch (error) {
      console.error('캐릭터 목록 불러오기 오류:', error);
    }
  };

  // 상태 메시지 입력 핸들러
  const handleStatusMessageChange = (index, value) => {
    const updatedMessages = [...characterStatusMessages];
    updatedMessages[index] = value;
    setCharacterStatusMessages(updatedMessages);
  };

  // 예시 대화 입력 핸들러
  const handleDialogueChange = (index, field, value) => {
    const updatedDialogues = [...exampleDialogues];
    updatedDialogues[index][field] = value;
    setExampleDialogues(updatedDialogues);
  };

  // 예시 대화 추가 및 삭제 핸들러
  const addExampleDialogue = () => {
    if (exampleDialogues.length >= 3) {
      alert('예시 대화는 최대 3개까지만 작성할 수 있습니다.');
      return;
    }
    setExampleDialogues([
      ...exampleDialogues,
      { userMessage: '', characterResponse: '' },
    ]);
  };

  const removeExampleDialogue = (index) => {
    const updatedDialogues = exampleDialogues.filter((_, i) => i !== index);
    setExampleDialogues(updatedDialogues);
  };

  // 작성 예시 버튼 핸들러
  const handleFillExample = () => {
    if (activeTab === 'profile') {
      setCharacterName(examplePrompts.profile.name);
      setCharacterDescription(examplePrompts.profile.description);
      setCharacterField(examplePrompts.profile.field);
    } else if (activeTab === 'details') {
      setCharacterAppearance(examplePrompts.details.appearance);
      setCharacterPersonality(examplePrompts.details.personality);
      setCharacterBackground(examplePrompts.details.background);
      setCharacterSpeechStyle(examplePrompts.details.speechStyle);
      setCharacterLikes('50');
      setCharacterStatusMessages(examplePrompts.details.statusMessages);
      setExampleDialogues(examplePrompts.details.exampleDialogues);
    }
  };

  // 탭 전환 핸들러
  const handleNext = () => {
    if (!characterImage) {
      alert('캐릭터 이미지를 업로드해주세요.');
      return;
    }
    if (activeTab === 'profile') setActiveTab('details');
  };

  const handleBack = () => {
    if (activeTab === 'details') setActiveTab('profile');
  };

  // 캐릭터 저장 API 호출
  const saveCharacter = async () => {
    // 이미지 필수 체크
    if (!characterImage) {
      alert('캐릭터 이미지를 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    const characterData = {
      user_idx: 'example_user',
      field_idx: characterField,
      voice_idx: 'default_voice',
      char_name: characterName,
      char_description: characterDescription,
      character_status_message: characterStatusMessages.filter(
        (msg) => msg.trim() !== ''
      ),
      favorability: parseInt(characterLikes, 10),
      character_appearance: { description: characterAppearance },
      character_personality: { description: characterPersonality },
      character_background: { description: characterBackground },
      character_speech_style: { description: characterSpeechStyle },
      example_dialogues: exampleDialogues,
    };

    formData.append('character_image', characterImage);
    formData.append('character_data', JSON.stringify(characterData));

    try {
      await axios.post('http://localhost:8000/api/characters/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCharacters();
      alert('캐릭터 생성 완료!');
    } catch (error) {
      console.error('캐릭터 생성 오류:', error);
      alert('캐릭터 생성 실패!');
    }
  };

  const deleteCharacter = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/characters/${id}`);
      fetchCharacters();
    } catch (error) {
      console.error('캐릭터 삭제 오류:', error);
    }
  };

  const generateTTS = async (text) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/generate-tts/',
        {
          text: text,
          speaker: selectedVoice,
          language: 'KO',
          speed: 1.0,
        },
        {
          responseType: 'arraybuffer', // 중요: 바이너리 데이터를 받기 위해 필요
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답이 성공적으로 왔는지 확인
      if (response.status === 200) {
        const audioBlob = new Blob([response.data], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // 이전 오디오 정리
        if (currentAudio) {
          currentAudio.pause();
          URL.revokeObjectURL(currentAudio.src);
        }

        // 새 오디오 생성 및 재생
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.play();
        setIsPlayingAudio(true);

        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('TTS 생성 오류:', error);

      // 에러 응답 처리
      if (error.response) {
        // 서버가 2xx 범위를 벗어난 상태 코드로 응답한 경우
        if (error.response.status === 500) {
          alert('TTS 서버 오류가 발생했습니다. 서버 상태를 확인해주세요.');
        } else {
          alert('TTS 생성 중 오류가 발생했습니다.');
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        alert(
          'TTS 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
        );
      } else {
        // 요청 설정 중 오류가 발생한 경우
        alert('TTS 요청 중 오류가 발생했습니다.');
      }

      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="character-manager">
      <div className="top-bar">
        <button onClick={() => navigate(-1)} className="create-back-button">
          <ArrowLeft size={24} />
        </button>
        <span className="page-title">캐릭터 만들기</span>
      </div>
      <div className="character-container">
        {/* 좌측 섹션 */}
        <div className="character-left">
          {/* 탭 메뉴 */}
          <div className="tab-menu">
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              프로필
            </button>
            <button
              className={activeTab === 'details' ? 'active' : ''}
              onClick={() => setActiveTab('details')}
            >
              상세 설정
            </button>
          </div>

          {/* 프로필 탭 */}
          {activeTab === 'profile' && (
            <div className="character-form">
              <label className="image-field-label">
                이미지{' '}
                <button onClick={handleFillExample} className="example-button">
                  작성 예시
                </button>
              </label>
              <div className="image-upload-container">
                <div className="image-management">
                  <div className="image-preview-section">
                    <div className="image-preview">
                      {previewImage ? (
                        <>
                          <img src={previewImage} alt="Character preview" />
                          <button
                            className="remove-image-btn"
                            onClick={handleRemoveImage}
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <div className="upload-placeholder">
                          <label
                            htmlFor="character-image"
                            className="upload-label"
                          >
                            <span>이미지</span>
                          </label>
                          <input
                            id="character-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="image-content">
                    <p className="image-description">
                      이미지를 필수로 등록해 주세요.
                    </p>
                    <div className="image-buttons">
                      <button
                        className="image-add-btn"
                        onClick={() =>
                          document.getElementById('character-image').click()
                        }
                      >
                        이미지 추가
                      </button>
                      <button
                        className="image-generate-btn"
                        onClick={() => setCurrentView('ai-test')}
                      >
                        이미지 생성
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <label>이름</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터 이름 입력"
              />

              <label>캐릭터 한 줄 소개</label>
              <textarea
                value={characterDescription}
                onChange={(e) => setCharacterDescription(e.target.value)}
                placeholder="캐릭터 소개 입력"
              />

              <label>캐릭터 필드</label>
              <input
                type="text"
                value={characterField}
                onChange={(e) => setCharacterField(e.target.value)}
                placeholder="캐릭터 필드 입력"
              />

              <button onClick={handleNext}>다음</button>
            </div>
          )}

          {/* 상세 설정 탭 */}
          {activeTab === 'details' && (
            <div className="character-form">
              <label>
                외모
                <button onClick={handleFillExample} className="example-button">
                  작성 예시
                </button>
              </label>
              <textarea
                value={characterAppearance}
                onChange={(e) => setCharacterAppearance(e.target.value)}
                placeholder="캐릭터 외모 설명"
              />

              <label>성격</label>
              <textarea
                value={characterPersonality}
                onChange={(e) => setCharacterPersonality(e.target.value)}
                placeholder="캐릭터 성격 설명"
              />

              <label>배경</label>
              <textarea
                value={characterBackground}
                onChange={(e) => setCharacterBackground(e.target.value)}
                placeholder="캐릭터 배경 설명"
              />

              <label>말투</label>
              <textarea
                value={characterSpeechStyle}
                onChange={(e) => setCharacterSpeechStyle(e.target.value)}
                placeholder="캐릭터 말투 설명"
              />

              <label>호감도</label>
              <input
                type="number"
                value={characterLikes}
                onChange={(e) => setCharacterLikes(e.target.value)}
                placeholder="0~100 사이 숫자 입력"
              />

              <label>상태 메시지</label>
              {characterStatusMessages.map((msg, index) => (
                <input
                  key={index}
                  type="text"
                  value={msg}
                  onChange={(e) =>
                    handleStatusMessageChange(index, e.target.value)
                  }
                  placeholder={`상태 메시지 ${index + 1}`}
                />
              ))}

              <label>예시 대화</label>
              {exampleDialogues.map((dialogue, index) => (
                <div key={index} className="example-dialogue">
                  <input
                    type="text"
                    value={dialogue.userMessage}
                    onChange={(e) =>
                      handleDialogueChange(index, 'userMessage', e.target.value)
                    }
                    placeholder="사용자가 보낼 메시지"
                  />
                  <input
                    type="text"
                    value={dialogue.characterResponse}
                    onChange={(e) =>
                      handleDialogueChange(
                        index,
                        'characterResponse',
                        e.target.value
                      )
                    }
                    placeholder="캐릭터가 답할 메시지"
                  />
                  <button onClick={() => removeExampleDialogue(index)}>
                    삭제
                  </button>
                </div>
              ))}
              <button onClick={addExampleDialogue}>예시 대화 추가</button>

              <div className="buttons-row">
                <button onClick={handleBack}>이전</button>
                <button onClick={saveCharacter}>생성 완료</button>
              </div>

              <h2>만든 캐릭터 목록</h2>
              <table className="character-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>필드</th>
                    <th>소개</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((char) => (
                    <tr key={char.char_idx}>
                      <td>{char.char_idx}</td>
                      <td>{char.char_name}</td>
                      <td>{char.field_idx}</td>
                      <td>{char.char_description}</td>
                      <td>
                        <button onClick={() => deleteCharacter(char.char_idx)}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 우측 섹션 */}
        <div className="character-right">
          <h2>채팅 미리보기</h2>
          <div className="preview-section">
            <div className="preview-content">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Character preview"
                  className="preview-image"
                />
              ) : (
                <div className="preview-image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              <div className="preview-text">
                <div className="preview-text-header">
                  <h3>{characterName || '캐릭터 이름'}</h3>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="tts-voice-choice"
                  >
                    {voiceOptions.map((voice) => (
                      <option key={voice.value} value={voice.value}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p>{characterDescription || '한 줄 소개'}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="chat-preview-section">
            <div className="chat-messages">
              {exampleDialogues.map((dialogue, index) => (
                <React.Fragment key={index}>
                  <div className="user-message">
                    <div className="message-content">
                      {dialogue.userMessage || '사용자 메시지를 입력해주세요'}
                    </div>
                  </div>
                  <div className="character-message">
                    <img
                      src={previewImage || '/default-avatar.png'}
                      alt="Character"
                      className="chat-avatar"
                    />
                    <div className="message-wrapper">
                      <div className="message-content">
                        {dialogue.characterResponse ||
                          '캐릭터 응답을 입력해주세요'}
                      </div>
                      <button
                        className={`tts-button ${
                          isPlayingAudio ? 'playing' : ''
                        }`}
                        onClick={() => generateTTS(dialogue.characterResponse)}
                        disabled={!dialogue.characterResponse}
                      >
                        <FiVolume2 size={20} />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterManager;
