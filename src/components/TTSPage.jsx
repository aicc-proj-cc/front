import React, { useState } from 'react';
import axios from 'axios';
import './TTSPage.css';

function TestPage() {
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState('paimon'); // 기본값 설정
  const [language, setLanguage] = useState('KO');
  const [speed, setSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 미리 지정된 캐릭터 목록
  const characterOptions = [
    { name: 'paimon', value: 'paimon' },
    { name: 'ganyu', value: 'ganyu' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 요청 시작 시 로딩 상태 활성화
    setAudioUrl(null); // 이전 오디오 URL 초기화

    try {
      const response = await axios.post(
        'http://localhost:8000/generate-tts/',
        {
          text: text,
          speaker: speaker, // 선택한 캐릭터 값 사용
          language: language,
          speed: parseFloat(speed),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // 오디오 파일을 받을 때 arraybuffer 사용
        }
      );

      console.log('response :', response);
      // Blob 생성 및 URL 생성
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating TTS:', error);
      alert('TTS 생성 중 오류가 발생했습니다. 입력 데이터를 확인하세요.');
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  return (
    <div className="test-page">
      <h1>TTS Test Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">Text:</label>
          <input
            className="tts-input"
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="speaker">Select Character:</label>
          <select
            className="tts-select"
            id="speaker"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            required
          >
            {characterOptions.map((character) => (
              <option key={character.value} value={character.value}>
                {character.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="KO">한국어</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="speed">Speed:</label>
          <input
            className="tts-input"
            type="number"
            id="speed"
            value={speed}
            step="0.1"
            min="0.5"
            max="2.0"
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>
        <button
          className="generate-tts-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate TTS'}
        </button>
      </form>

      {audioUrl && (
        <div className="audio-player">
          <h2>Generated Audio:</h2>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default TestPage;
