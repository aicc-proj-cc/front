import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/main/HomePage';
import Sidebar from './components/common/Sidebar';
import CharacterManager from './components/CharacterManager'; // 캐릭터 등록 페이지
import CharacterSearch from './components/CharacterSearch'; // 캐릭터 조회 페이지
import ChatPage from './components/ChatPage'; // 채팅 페이지
import ImageCreate from './components/image_create/ImageCreate'; // 이미지 생성 페이지
import TTSPage from './components/TTSPage'; // TTS 테스트 페이지
import Upperbar from './components/common/Upperbar';
import Signup from './components/main/Signup';
import Signin from './components/main/Signin';
import Search from './components/main/Search';
import Rank from './components/main/Rank';
import Mypage from './components/main/Mypage';
import Wordcloud from './components/main/Wordcloud';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-main-frame">
        <div className="app-main-sidebar">
          <Sidebar /> {/* 고정된 사이드바 */}
        </div>
        <div className="app-main-content">
          <Upperbar /> {/* 상단 바 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/CharacterManager" element={<CharacterManager />} />
            <Route path="/CharacterSearch" element={<CharacterSearch />} />
            <Route path="/ChatPage" element={<ChatPage />} />
            <Route path="/generate-image" element={<ImageCreate />} />
            <Route path="/TTSPage" element={<TTSPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/search" element={<Search />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/wordcloud" element={<Wordcloud />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
