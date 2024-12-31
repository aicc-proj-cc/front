import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/main/HomePage';
import Sidebar from './components/common/Sidebar';
import UpperBar from './components/common/UpperBar';

function Main() {
  return (
    <BrowserRouter>
      <div className="fix-section">
        <Sidebar />
        <UpperBar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
