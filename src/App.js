import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/main/HomePage';
import Sidebar from './components/common/Sidebar';
import CharacterManager from './components/CharacterManager';

function App() {
  return (
    <BrowserRouter>
      <div className="fix-section">
        <Sidebar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/CharacterManager" element={<CharacterManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
