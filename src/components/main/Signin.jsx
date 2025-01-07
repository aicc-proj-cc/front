import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000';

const Signin = ({ onLoginSuccess, onLogout }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate 초기화

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get(`${BASE_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsLoggedIn(true);
          if (onLoginSuccess) onLoginSuccess();
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
        });
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/signin`, {
        user_id: userId,
        password,
      });
      const { token, message } = response.data;
      localStorage.setItem('authToken', token);
      setMessage(message || '로그인 성공!');
      setIsLoggedIn(true);
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || '네트워크 문제로 로그인에 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setMessage('로그아웃 되었습니다.');
    if (onLogout) onLogout();
    navigate('/'); // 로그인 화면으로 리디렉션
  };

  return (
    <div className="flex justify-center items-center bg-primary h-screen">
      <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white">Log In</h2>
        {!isLoggedIn ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <input
              type="text"
              placeholder="Your Id"
              aria-label="Your Id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-600 focus:outline-none focus:ring focus:gradient text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-600  focus:outline-none focus:ring focus:gradient text-white"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-button hover:bg-hover text-white py-3 rounded-lg font-bold ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Loading...' : 'Log In'}
            </button>
          </form>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full bg-button hover:bg-hover text-white py-3 rounded-lg font-bold"
          >
            Log Out
          </button>
        )}
        {message && <p className="mt-4 text-center text-white">{message}</p>}
      </div>
    </div>
  );
};

export default Signin;
