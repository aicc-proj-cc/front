import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Wordcloud = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // JWT 토큰에서 user_idx 추출
    const fetchWordcloud = async () => {
      try {
        const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴
        if (!token) {
          throw new Error('No token found');
        }

        // 토큰 디코딩
        const decodedToken = jwtDecode(token);
        const userIdx = decodedToken.user_idx; // 토큰에서 user_idx 추출
        if (!userIdx) {
          throw new Error('user_idx not found in token');
        }

        // FastAPI 서버에서 워드클라우드 이미지 가져오기
        const response = await fetch(
          `http://localhost:8000/api/user-wordcloud/${userIdx}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더에 토큰 추가
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch wordcloud image');
        }
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error fetching wordcloud:', error);
      }
    };

    fetchWordcloud();
  }, []);

  return (
    <div className="wordcloud-container h-full flex flex-col items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Wordcloud"
          style={{ width: '50%', height: 'auto' }}
        />
      ) : (
        <p>워드클라우드 이미지를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Wordcloud;
