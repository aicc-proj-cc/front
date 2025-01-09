import React, { useState } from 'react';
import axios from 'axios';
import './ImageCreate.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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

  // 뒤오가기 버튼
  const navigate = useNavigate();

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
    <div className="imageCreate-container">
      <div className="image-create-title">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Custom Your Character</h1>
      </div>
      <br />
      <div className="image-create-area">
        <div className="image-create-left">
          {/* 그림체 선택 */}
          <div className="choose-image-style">
            <h3>Style</h3>
            <button onClick={() => handleStyleChange('cute')}>일본 만화</button>
            <button onClick={() => handleStyleChange('powerful')}>
              현실 주의
            </button>
            <button onClick={() => handleStyleChange('retro')}>
              레트로 감성
            </button>
            <button onClick={() => handleStyleChange('cyberpunk')}>
              사이버펑크
            </button>
            <br />
          </div>

          {/* 배경 선택 */}
          <div className="choose-bg-style">
            <h3>Background</h3>
            <div className="bg-outdoor">
              <h4>Outdoor</h4>
              <button
                onClick={() => handleBackgroundChange('beach', 'outdoor')}
              >
                해변가
              </button>
              <button
                onClick={() => handleBackgroundChange('starrySky', 'outdoor')}
              >
                푸른 하늘
              </button>
              <button
                onClick={() => handleBackgroundChange('forest', 'outdoor')}
              >
                숲
              </button>
              <button
                onClick={() => handleBackgroundChange('castle', 'outdoor')}
              >
                판타지 성
              </button>
            </div>

            <div className="bg-indoor">
              <h4>Indor</h4>
              <button
                onClick={() => handleBackgroundChange('classroom', 'indoor')}
              >
                교실
              </button>
              <button
                onClick={() => handleBackgroundChange('concertStage', 'indoor')}
              >
                콘서트 무대
              </button>
              <button
                onClick={() => handleBackgroundChange('corridor', 'indoor')}
              >
                복도
              </button>
              <button onClick={() => handleBackgroundChange('cafe', 'indoor')}>
                카페
              </button>
            </div>
          </div>

          <div className="choose-filter">
            {/* 필터 스타일 선택 */}
            <h3>Filter</h3>
            <button onClick={() => handleFilterChange('natural')}>
              Natural Daylight
            </button>
            <button onClick={() => handleFilterChange('neon')}>
              Neon Lighting
            </button>
            <button onClick={() => handleFilterChange('cold')}>
              Cold Lighting
            </button>
            <button onClick={() => handleFilterChange('rainbow')}>
              Rainbow Light
            </button>
          </div>
          <br />

          <div className="choose-size">
            <h3>Size</h3>

            <select
              onChange={(e) => handleDimensionChange(e.target.value)} // 드롭다운에서 선택하면 handleDimensionChange 호출
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="square">정사각형 (512x512)</option>
              <option value="portrait">세로형 (512x880)</option>
              <option value="landscape">가로형 (880x512)</option>
            </select>
          </div>
          <br />
          <div className="choose-guidance">
            <h3>Guidance</h3>
            <p className="c-dic">
              프롬프트 충실 단계가 높을수록 소요되는 시간이 증가됩니다.
            </p>
            <button onClick={() => handleGuidanceScale('low')}>Low</button>
            <button onClick={() => handleGuidanceScale('normal')}>
              Normal
            </button>
            <button onClick={() => handleGuidanceScale('high')}>High</button>
          </div>
          <br />
          <div className="chose-noise">
            <h3>Noise</h3>
            <p className="c-dic">
              노이즈 제거 단계가 높을수록 소요되는 시간이 증가됩니다.
            </p>
            <div>
              <button onClick={() => handleInferenceStepChange('low')}>
                Low
              </button>
              <button onClick={() => handleInferenceStepChange('normal')}>
                Normal
              </button>
              <button onClick={() => handleInferenceStepChange('high')}>
                High
              </button>
            </div>
          </div>
        </div>
        <br />

        <div className="image-create-right">
          {/* 사용자 프롬프트 입력 */}
          <div className="user-prompts">
            <h3>Promt</h3>

            <textarea
              className=""
              placeholder="원하는 프롬프트를 입력해 나만의 캐릭터 이미지를 만들어보세요."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows="3"
              cols="50"
            />
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? '생성 중...' : '이미지 생성'}
          </button>
        </div>

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
    </div>
  );
};

export default ImageCreate;
