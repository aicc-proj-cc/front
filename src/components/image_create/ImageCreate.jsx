import React, { useState } from 'react';
import axios from 'axios';
import './ImageCreate.css';

const ImageCreate = () => {
  const [userPrompt, setUserPrompt] = useState(
    'face focus, cute, masterpiece, best quality, 1girl, brown hair, sweater, looking at viewer, upper body, beanie, outdoors, night, turtleneck'
  ); // 사용자 프롬프트
  const [negativePrompt, setNegativePrompt] = useState(
    'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'
  ); // 네거티브 프롬프트

  const [guidanceScale, setGuidanceScale] = useState(7.5); // 가이던스 스케일
  const [numInferenceSteps, setNumInferenceSteps] = useState(50); // 추론 단계
  const [generatedImage, setGeneratedImage] = useState(null); // 생성된 이미지
  const [loading, setLoading] = useState(false); // 로딩 상태

  // width와 height를 설정할 state
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 }); // 기본값: 정사각형

  const handleGenerateImage = async () => {
    if (!userPrompt.trim()) {
      alert('프롬프트를 입력하세요!');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/generate-image/',
        {
          prompt: userPrompt,
          negative_prompt: negativePrompt,
          width: dimensions.width, // dimensions 사용
          height: dimensions.height, // dimensions 사용
          guidance_scale: parseFloat(guidanceScale),
          num_inference_steps: parseInt(numInferenceSteps, 10),
        }
      );

      setGeneratedImage(`data:image/png;base64,${response.data.image}`);
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 드롭다운 선택 시 width와 height를 설정하는 함수
  const handleDimensionChange = (value) => {
    const options = {
      square: { width: 512, height: 512 }, // 정사각형
      portrait: { width: 512, height: 880 }, // 세로형
      landscape: { width: 880, height: 512 }, // 가로형
    };
    setDimensions(options[value]);
  };

  // Num Inference Steps(노이즈 제거 단계) 버튼 클릭 핸들러 추가
  const handleInferenceStepChange = (value) => {
    const options = {
      low: 30, // Low 단계
      normal: 50, // Normal 단계
      high: 60, // High 단계
    };
    setNumInferenceSteps(options[value]); // 선택한 값으로 numInferenceSteps 업데이트

    console.log(
      `선택된 노이즈 제거 단계: ${value}, 설정된 값: ${options[value]}`
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI 이미지 생성</h1>
      <textarea
        placeholder="프롬프트를 입력하세요..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: '16px', padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="네거티브 프롬프트를 입력하세요..."
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: '16px', padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <label>
        Dimensions:
        <select
          onChange={(e) => handleDimensionChange(e.target.value)} // 드롭다운에서 선택하면 handleDimensionChange 호출
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="square">정사각형 (512x512)</option>
          <option value="portrait">세로형 (512x880)</option>
          <option value="landscape">가로형 (880x512)</option>
        </select>
      </label>
      <br />
      <label>
        Guidance Scale(근사치, 수치가 큰수록 프롬프트에 충실):
        <input
          type="number"
          step="0.1"
          value={guidanceScale}
          onChange={(e) => setGuidanceScale(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
        />
      </label>
      <br />
      <label>
        Num Inference Steps(노이즈 제거 단계):
        <div>
          <button onClick={() => handleInferenceStepChange('low')}>
            Low (30)
          </button>
          <button onClick={() => handleInferenceStepChange('normal')}>
            Normal (50)
          </button>
          <button onClick={() => handleInferenceStepChange('high')}>
            High (60)
          </button>
        </div>
      </label>

      <br />
      <button
        onClick={handleGenerateImage}
        disabled={loading}
        style={{ marginTop: '10px' }}
      >
        {loading ? '생성 중...' : '이미지 생성'}
      </button>
      {generatedImage && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={generatedImage}
            alt="생성된 이미지"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCreate;
