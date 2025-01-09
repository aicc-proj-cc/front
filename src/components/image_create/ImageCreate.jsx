import React, { useState } from 'react';
import axios from 'axios';
import './ImageCreate.css';

const ImageCreate = () => {
  // =======텍스트 프롬프트========
  const [basePrompt, setBasePrompt] = useState(
    'face focus, masterpiece, best quality, upper body, close-up, looking at viewer, one person, detailed hair, high-quality hair,detailed eyes,lively eyes, Natural transition between the white of the eye and the iris'
  ); // 기본 프롬프트
  const [excludedPrompt, setExcludedPrompt] = useState(
    'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'
  ); // 제외된 프롬프트
  const [customPrompt, setCustomPrompt] = useState(''); // 사용자가 작성한 프롬프트

  // ======선택한 그림체, 배경, 필터 스타일을 저장========
  const [stylePrompt, setStylePrompt] = useState(''); // 그림체
  const [backgroundPrompt, setBackgroundPrompt] = useState(''); // 배경
  const [filterPrompt, setFilterPrompt] = useState(''); // 필터 스타일

  // ======선택한 프롬프트 충실도, 노이즈, 이미지 크기 단계 저장=======
  const [guidanceScale, setGuidanceScale] = useState(7.5); // 프롬프트 충실도 단계 상태 초기화
  const [numInferenceSteps, setNumInferenceSteps] = useState(50); // 노이즈 단계 상태 초기화
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 }); // width와 height 상태 초기화

  // 배경 실내/실외 선택 처리 값
  const [indoorSelected, setIndoorSelected] = useState(''); // 실내 선택된 값
  const [outdoorSelected, setOutdoorSelected] = useState(''); // 실외 선택된 값

  const [generatedImage, setGeneratedImage] = useState(null); // 생성된 이미지
  const [loading, setLoading] = useState(false); // 로딩 상태

  // =======전체 프롬프트 생성 함수=======
  const getFullPrompt = () => {
    console.log('-------------');
    console.log('기본 적용 프롬프트:', basePrompt);
    console.log('이미지 스타일:', stylePrompt);
    console.log('배경 선택:', backgroundPrompt);
    console.log('필터 선택:', filterPrompt);
    console.log('사용자 입력 프롬프트:', customPrompt);

    const fullPrompt = `${basePrompt}, ${stylePrompt}, ${backgroundPrompt}, ${filterPrompt}, ${customPrompt}`;
    return fullPrompt;
  };

  const handleGenerateImage = async () => {
    const fullPrompt = getFullPrompt();

    if (!fullPrompt.trim()) {
      alert('프롬프트를 입력하세요!');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/generate-image/`,
        {
          prompt: fullPrompt,
          negative_prompt: excludedPrompt,
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

  // ============프롬프트 선택지================

  // 드롭다운 선택 시 width와 height를 설정하는 함수
  const handleDimensionChange = (value) => {
    const options = {
      square: { width: 512, height: 512 }, // 정사각형
      portrait: { width: 512, height: 880 }, // 세로형
      landscape: { width: 880, height: 512 }, // 가로형
    };
    setDimensions(options[value]);
  };

  // 그림체 선택
  const handleStyleChange = (style) => {
    const styles = {
      cute: 'cute',
      powerful: 'powerful',
      retro: 'retro',
      cyberpunk: 'cyberpunk',
    };
    setStylePrompt(styles[style]);
  };

  // 배경 선택
  const handleBackgroundChange = (background, category) => {
    const backgrounds = {
      beach: 'ocean view, on the beach',
      starrySky: 'starry sky, night with stars',
      forest: 'green forest, lot of trees',
      castle: 'ancient castle, majestic architecture',
      classroom: 'inside a classroom, desks and chairs',
      concertStage: 'on concert stage, spotlights and crowd',
      corridor: 'long corridor, bright lights',
      cafe: 'inside a cozy cafe, tables and coffee cups',
    };
    // 실내와 실외 선택지는 상호 배타적이므로 다른 카테고리 선택 시 초기화
    if (category === 'indoor') {
      setOutdoorSelected(''); // 실외 선택 초기화
    } else if (category === 'outdoor') {
      setIndoorSelected(''); // 실내 선택 초기화
    }

    setBackgroundPrompt(backgrounds[background]); // 선택된 배경 프롬프트 저장
    if (category === 'indoor') {
      setIndoorSelected(background); // 실내 선택된 값 업데이트
    } else {
      setOutdoorSelected(background); // 실외 선택된 값 업데이트
    }
  };

  // 필터 스타일 선택
  const handleFilterChange = (filter) => {
    const filters = {
      natural: 'natural daylight',
      neon: 'neon lighting',
      cold: 'cold lighting',
      rainbow: 'rainbow light',
    };
    setFilterPrompt(filters[filter]);
  };

  // Num Inference Steps(노이즈 제거 단계)
  const handleInferenceStepChange = (value) => {
    const options = {
      // 단계가 낮으면 선 처리가 조금 더 투박한 느낌
      low: 30, // Low 단계
      normal: 50, // Normal 단계
      high: 60, // High 단계
    };
    setNumInferenceSteps(options[value]); // 선택한 값으로 numInferenceSteps 업데이트

    console.log(
      `선택된 노이즈 제거 단계: ${value}, 설정된 값: ${options[value]}`
    );
  };

  const handleGuidanceScale = (value) => {
    // 단계가 낮을수록 조금 오묘한 이미지가 생성 됨(모호 필터한 것 처럼)
    // 단계가 높으면 조금 더 샤프한 이미지가 생성 됨
    const options = {
      low: 6.5,
      normal: 7.5,
      high: 8.5,
    };
    setGuidanceScale(options[value]);
    console.log(
      `선택된 프롬프트 충실도 단계: ${value}, 설정된 값: ${options[value]}`
    );
  };

  return (
    <div className="imageCreate-container" style={{ padding: '20px' }}>
      <h1>AI 이미지 생성</h1>
      <textarea
        placeholder="기본 프롬프트를 입력하세요..."
        value={basePrompt}
        onChange={(e) => setBasePrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: '16px', padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="제외되는 프롬프트를 입력하세요..."
        value={excludedPrompt}
        onChange={(e) => setExcludedPrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: '16px', padding: '10px', marginBottom: '10px' }}
      />
      <br />

      {/* 사용자 프롬프트 입력 */}
      <textarea
        placeholder="사용자가 작성한 프롬프트를 입력하세요..."
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        rows="3"
        cols="50"
      />
      <br />

      {/* 그림체 선택 */}
      <label>그림체:</label>
      <button onClick={() => handleStyleChange('cute')}>Cute</button>
      <button onClick={() => handleStyleChange('powerful')}>Powerful</button>
      <button onClick={() => handleStyleChange('retro')}>Retro</button>
      <button onClick={() => handleStyleChange('cyberpunk')}>Cyberpunk</button>
      <br />

      {/* 배경 선택 */}
      <div>
        <strong>실외:</strong>
        <button onClick={() => handleBackgroundChange('beach', 'outdoor')}>
          Beach
        </button>
        <button onClick={() => handleBackgroundChange('starrySky', 'outdoor')}>
          Starry Sky
        </button>
        <button onClick={() => handleBackgroundChange('forest', 'outdoor')}>
          Forest
        </button>
        <button onClick={() => handleBackgroundChange('castle', 'outdoor')}>
          Castle
        </button>
      </div>
      <div>
        <strong>실내:</strong>
        <button onClick={() => handleBackgroundChange('classroom', 'indoor')}>
          Classroom
        </button>
        <button
          onClick={() => handleBackgroundChange('concertStage', 'indoor')}
        >
          Concert Stage
        </button>
        <button onClick={() => handleBackgroundChange('corridor', 'indoor')}>
          Corridor
        </button>
        <button onClick={() => handleBackgroundChange('cafe', 'indoor')}>
          Cafe
        </button>
      </div>

      {/* 필터 스타일 선택 */}
      <label>필터 스타일:</label>
      <button onClick={() => handleFilterChange('natural')}>
        Natural Daylight
      </button>
      <button onClick={() => handleFilterChange('neon')}>Neon Lighting</button>
      <button onClick={() => handleFilterChange('cold')}>Cold Lighting</button>
      <button onClick={() => handleFilterChange('rainbow')}>
        Rainbow Light
      </button>
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
        Guidance Scale(프롬프트에 충실 단계):
        <button onClick={() => handleGuidanceScale('low')}>Low(6.5)</button>
        <button onClick={() => handleGuidanceScale('normal')}>
          Normal(7.5)
        </button>
        <button onClick={() => handleGuidanceScale('high')}>High(8.5)</button>
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
