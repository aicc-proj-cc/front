import React from 'react';
import './Sidebar.css';

// svg 아이콘
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Create } from '../../assets/icons/create.svg';
import { ReactComponent as Explore } from '../../assets/icons/explore.svg';
import { ReactComponent as Chat } from '../../assets/icons/chat.svg';
import { ReactComponent as Friends } from '../../assets/icons/friends.svg';

// 로고
import logo from '../../assets/logo.png';

// 임시 아이콘, 나중에 실제 사용자 프로필 사진으로 교체해야 함
import account from '../../assets/icons/account.png';

const Sidebar = () => {
  return (
    <div className="side-container">
      <div className="side-wrapper">
        <div>
          <div className="side-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="button-create-char">
            <div className="retangle">
              <Create className="logout" />
              <div>Create</div>
            </div>
          </div>

          <div className="side-tap">
            {/* 캐릭터 조회 */}
            <div className="side-find">
              <Explore className="explore" />
              <div>Find</div>
            </div>

            {/* 채팅 화면 */}
            <div className="side-chat">
              <Chat className="chat" />
              <div>Chat</div>
            </div>

            {/* 친구 리스트 */}
            <div className="side-Gganbu">
              <Friends className="friends" />
              <div>Gganbu</div>
            </div>
          </div>
        </div>
        <div>
          <div className="side-myInfo">
            <img src={account} alt="account" />
            <div>내 닉네임</div>
          </div>
          <div className="side-logout">
            <Logout className="logout" />
            <div>Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
