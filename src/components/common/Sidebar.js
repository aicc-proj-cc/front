import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';

import { ReactComponent as Login } from '../../assets/icons/login.svg';
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Create } from '../../assets/icons/create.svg';
import { ReactComponent as Explore } from '../../assets/icons/explore.svg';
import { ReactComponent as Chat } from '../../assets/icons/chat.svg';
import { ReactComponent as Friends } from '../../assets/icons/friends.svg';

import logo from '../../assets/logo.png';
import account from '../../assets/icons/account.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('로그인 필요');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken');
    const savedNickname = localStorage.getItem('userNickname');
    if (token && savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
    } else {
      setIsLoggedIn(false);
      setNickname('로그인 필요');
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 상태 확인
    checkLoginStatus();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // localStorage 비우기
      localStorage.removeItem('authToken');
      localStorage.removeItem('userNickname');

      // 상태 즉시 업데이트
      setIsLoggedIn(false);
      setNickname('로그인 필요');

      // 커스텀 이벤트 발생
      window.dispatchEvent(new Event('loginStateChange'));

      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="side-container">
      <div className="side-wrapper">
        <div>
          <div className="side-logo" onClick={() => navigate('/')}>
            <img src={logo} alt="logo" />
          </div>
          <div className="button-create-char">
            <div
              className="retangle"
              onClick={() => navigate('/CharacterManager')}
            >
              <Create className="logout" />
              <div>Create</div>
            </div>
          </div>

          <div className="side-tap">
            <div className="side-find" onClick={() => navigate('/')}>
              <Explore className="explore" />
              <div>Find</div>
            </div>

            {/* 채팅 화면 */}
            <div className="side-chat" onClick={() => navigate('/ChatPage')}>
              <Chat className="chat" />
              <div>Chat</div>
            </div>

            <div className="side-Gganbu" onClick={() => navigate('/Gganbu')}>
              <Friends className="friends" />
              <div>Gganbu</div>
            </div>
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <div>
              <div className="side-myInfo">
                <Link to="/mypage">
                  <img src={account} alt="account" className="account-icon" />
                </Link>
                <div className="nickname-text">{`${nickname} 님`}</div>
              </div>
              <div className="side-logout" onClick={handleLogout}>
                <Logout className="logout" />
                <div>Logout</div>
              </div>
            </div>
          ) : (
            <div className="side-login">
              <Login className="login" />
              <div>
                <Link to="/signin" className="flex justify-center">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
