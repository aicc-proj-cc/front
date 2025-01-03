import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import axios from 'axios';

const MyPage = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate 초기화

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            'http://127.0.0.1:8000/verify-token',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userId = response.data.user_id;

          const userDetailResponse = await axios.get(
            `http://127.0.0.1:8000/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserInfo(userDetailResponse.data);
        } catch (err) {
          localStorage.removeItem('authToken');
          setError('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
          if (onLogout) onLogout();
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserInfo();
    } else {
      setError('로그인이 필요합니다.');
      setIsLoading(false);
    }
  }, [onLogout]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/'); // 로그아웃 후 첫 화면으로 이동
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1e2a47]">
        <p className="text-lg text-white">로딩 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1e2a47]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e2a47] flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#2e3a5c] rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          마이페이지
        </h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {userInfo?.profile_picture ? (
              <img
                src={userInfo.profile_picture}
                alt="프로필 사진"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white">
                사진 없음
              </div>
            )}
            <p className="text-white text-lg">
              <span className="font-semibold">이름:</span> {userInfo.nickname}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mt-6 font-bold"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
