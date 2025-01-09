import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setMessage('로그인이 필요합니다.');
      navigate('/signin');
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        console.log('토큰 확인:', token);

        const { data: tokenData } = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/verify-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('토큰 데이터:', tokenData);

        const { data: userInfo } = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/users/${tokenData.user_idx}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('사용자 정보:', userInfo);

        setUserInfo(userInfo);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        setMessage('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
        localStorage.removeItem('authToken');
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNickname'); // 닉네임 제거
    setUserInfo(null);

    // 로그아웃 상태 업데이트 이벤트
    window.dispatchEvent(new Event('loginStateChange'));

    navigate('/'); // / 경로로 리다이렉트
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-full max-w-lg bg-sub rounded-lg shadow-md p-6 ">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          마이페이지
        </h1>
        {userInfo ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {userInfo.profile_picture ? (
                <img
                  src={userInfo.profile_picture}
                  alt="프로필 사진"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  사진 없음
                </div>
              )}
              <p className="text-white text-lg w-full flex justify-center">
                <span className="font-semibold">이름:</span> {userInfo.nickname}
              </p>
              <div className="mypage_info flex gap-2">
                {' '}
                <Link to="/Rank">
                  <button className=" rounded-md p-2 bg-button hover:bg-hover">
                    Rank
                  </button>
                </Link>
                <Link to="/Wordcloud">
                  <button className=" rounded-md p-2 bg-button hover:bg-hover">
                    Wordcloud
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white">사용자 정보를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Mypage;
