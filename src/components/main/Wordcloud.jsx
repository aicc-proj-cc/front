import React, { useEffect, useState } from 'react';

const Wordcloud = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // FastAPI 서버에서 워드클라우드 이미지를 가져오기
    const fetchWordcloud = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/wordcloud');
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
