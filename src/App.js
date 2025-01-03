import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/main/HomePage';
import Sidebar from './components/common/Sidebar';
import CharacterManager from './components/CharacterManager'; // 캐릭터 등록 페이지
import CharacterSearch from './components/CharacterSearch'; // 캐릭터 조회 페이지
import ChatPage from './components/ChatPage'; // 채팅 페이지
import ImageCreate from './components/ImageCreate'; // 이미지 생성 페이지
import TTSPage from './components/TTSPage'; // TTS 테스트 페이지

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-main-frame">
        <div className="app-main-sidebar">
          <Sidebar /> {/* 고정된 사이드바 */}
        </div>
        <div className="app-main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/CharacterManager"
              element={<CharacterManager />}
            />{' '}
            {/* 캐릭터 등록 */}
            <Route path="/CharacterSearch" element={<CharacterSearch />} />{' '}
            {/* 캐릭터 조회 */}
            <Route path="/ChatPage" element={<ChatPage />} />{' '}
            {/* 채팅 페이지 */}
            <Route path="/image-create" element={<ImageCreate />} />{' '}
            {/* 이미지 생성 */}
            <Route path="/TTSPage" element={<TTSPage />} /> {/* TTS 테스트 */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
