import React, { useEffect } from 'react';
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

const Sidebar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 초기화
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]); // 컴포넌트가 마운트될 때 실행

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // 토큰 삭제
    setIsLoggedIn(false); // 상태 업데이트
    navigate('/signin'); // 로그인 페이지로 이동
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
            <img src={account} alt="account" />
            <button className="rounded-md p-2">
              <Link to="/mypage">마이페이지</Link>
            </button>
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
