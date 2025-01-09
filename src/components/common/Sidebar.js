import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sidebar.css';

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

  useEffect(() => {
    // 초기 로그인 상태 확인
    const token = localStorage.getItem('authToken');
    const savedNickname = localStorage.getItem('userNickname');
    if (token && savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
    } else {
      setIsLoggedIn(false);
      setNickname('로그인 필요');
    }

    // localStorage 변경 감지
    const handleStorageChange = () => {
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

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNickname');
    setIsLoggedIn(false);
    setNickname('로그인 필요');
    window.dispatchEvent(new Event('loginStateChange'));
    navigate('/');
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
            <div className="side-chat" onClick={() => navigate('/ChatPage')}>
              <Chat className="chat" />
              <div>Chat</div>
            </div>
            <div className="side-Gganbu">
              <Friends className="friends" />
              <div>Gganbu</div>
            </div>
          </div>
        </div>

        <div>
          <div className="side-myInfo">
            <img
              src={account}
              alt="account"
              className="account-icon"
              onClick={handleAccountClick}
            />
            <div className="nickname-text">
              {isLoggedIn ? `${nickname} 님` : nickname}
            </div>
          </div>
          {isLoggedIn ? (
            <div className="side-logout" onClick={handleLogout}>
              <Logout className="logout" />
              <div>Logout</div>
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
