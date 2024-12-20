import React, { useState } from "react";
import axios from "axios";

const AITestPage = () => {
  const [userPrompt, setUserPrompt] = useState("face focus, cute, masterpiece, best quality, 1girl, brown hair, sweater, looking at viewer, upper body, beanie, outdoors, night, turtleneck"); // 사용자 프롬프트
  const [negativePrompt, setNegativePrompt] = useState("lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"); // 네거티브 프롬프트
  const [width, setWidth] = useState(512); // 이미지 가로 크기
  const [height, setHeight] = useState(512); // 이미지 세로 크기
  const [guidanceScale, setGuidanceScale] = useState(7.5); // 가이던스 스케일
  const [numInferenceSteps, setNumInferenceSteps] = useState(50); // 추론 단계
  const [generatedImage, setGeneratedImage] = useState(null); // 생성된 이미지
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handleGenerateImage = async () => {
    if (!userPrompt.trim()) {
      alert("프롬프트를 입력하세요!");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await axios.post("http://localhost:8000/generate-image/", {
        prompt: userPrompt,
        negative_prompt: negativePrompt,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        guidance_scale: parseFloat(guidanceScale),
        num_inference_steps: parseInt(numInferenceSteps, 10),
      });

      setGeneratedImage(`data:image/png;base64,${response.data.image}`);
    } catch (error) {
      console.error("이미지 생성 오류:", error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI 이미지 생성</h1>
      <textarea
        placeholder="프롬프트를 입력하세요..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: "16px", padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <textarea
        placeholder="네거티브 프롬프트를 입력하세요..."
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        rows="3"
        cols="50"
        style={{ fontSize: "16px", padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <label>
        Width:
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
        />
      </label>
      <br />
      <label>
        Height:
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
        />
      </label>
      <br />
      <label>
        Guidance Scale:
        <input
          type="number"
          step="0.1"
          value={guidanceScale}
          onChange={(e) => setGuidanceScale(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
        />
      </label>
      <br />
      <label>
        Num Inference Steps:
        <input
          type="number"
          value={numInferenceSteps}
          onChange={(e) => setNumInferenceSteps(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
        />
      </label>
      <br />
      <button onClick={handleGenerateImage} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "생성 중..." : "이미지 생성"}
      </button>
      {generatedImage && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={generatedImage}
            alt="생성된 이미지"
            style={{ maxWidth: "100%", maxHeight: "400px" }}
          />
        </div>
      )}
    </div>
  );
};

export default AITestPage;
