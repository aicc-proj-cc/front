import React, { useState } from 'react';
import axios from 'axios';

const Wordcloud = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWordcloud = async () => {
    const token = localStorage.getItem('authToken'); // 토큰 가져오기
    const userIdx = localStorage.getItem('user_idx');
    if (!userIdx) {
      alert('로그인이 필요합니다.');
      window.location.href = '/signin';
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/user-wordcloud/${userIdx}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // 이미지 데이터를 blob 형식으로 받기
        }
      );

<<<<<<< HEAD
        // 토큰 디코딩
        const decodedToken = jwtDecode(token);
        const userIdx = decodedToken.user_idx; // 토큰에서 user_idx 추출
        if (!userIdx) {
          throw new Error('user_idx not found in token');
        }

        // FastAPI 서버에서 워드클라우드 이미지 가져오기
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_DOMAIN}/api/user-wordcloud/${userIdx}`,
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
=======
      const imageURL = URL.createObjectURL(response.data);
      setImageSrc(imageURL);
    } catch (err) {
      console.error(err);
      setError('워드클라우드를 생성하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 486d6de8fca9260ea6fc8fdaf7a1a30ef7fda904

  return (
    <div className="wordcloud-container">
      <h1>Wordcloud 생성</h1>
      <button
        onClick={fetchWordcloud}
        disabled={loading}
        className="w-full text-center"
      >
        {loading ? '생성 중...' : '워드클라우드 가져오기'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageSrc && (
        <div className="w-full flex justify-center">
          <div className="w-full flex justify-center">
            {' '}
            <img
              src={imageSrc}
              alt="User Wordcloud"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordcloud;
