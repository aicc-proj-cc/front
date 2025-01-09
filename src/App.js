import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// MAIN
import HomePage from './components/main/HomePage';
import Signup from './components/main/Signup';
import User from './components/main/User';
import Search from './components/main/Search';
import Rank from './components/main/Rank';
import Wordcloud from './components/main/Wordcloud';

// COMMON
import Sidebar from './components/common/Sidebar';
import Upperbar from './components/common/Upperbar';

import CharacterManager from './components/CharacterManager';
import ChatPage from './components/ChatPage';
import ImageCreate from './components/image_create/ImageCreate';
import TTSPage from './components/TTSPage';

import './App.css';
import Signin from './components/main/Signin';
import Mypage from './components/main/Mypage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-main-frame">
        <div className="app-main-sidebar">
          <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
        <div className="app-main-content">
          <Upperbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/CharacterManager" element={<CharacterManager />} />
            <Route path="/ChatPage" element={<ChatPage />} />
            <Route path="/ChatPage/:chatRoomId" element={<ChatPage />} />
            <Route path="/generate-image" element={<ImageCreate />} />
            <Route path="/TTSPage" element={<TTSPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user" element={<User />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route
              path="/signin"
              element={<Signin setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/wordcloud" element={<Wordcloud />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
