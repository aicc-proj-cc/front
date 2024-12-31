import React from 'react';

const Sidebar = () => {
  return (
    <div className="side-container">
      <div className="side-wrapper">
        <div className="side-logo">로고 이미지</div>
        <div className="button-create-char">
          <div>아이콘</div>
          <div>Create</div>
        </div>
        <div className="side-tap">
          <div className="side-find">
            <div>아이콘</div>
            <div>Find</div>
          </div>
          <div className="side-chat">
            <div>아이콘</div>
            <div>Chat</div>
          </div>
          <div className="side-Gganbu">
            <div>아이콘</div>
            <div>Gganbu</div>
          </div>
        </div>
        <div className="side-myInfo">
          <div>내 프로필 사진</div>
          <div>내 닉네임</div>
        </div>
        <div className="side-logout">로그아웃 버튼</div>
      </div>
    </div>
  );
};

export default Sidebar;
