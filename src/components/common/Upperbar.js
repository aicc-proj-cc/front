import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link 가져오기
import { useNavigate } from 'react-router-dom';

const Upperbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full py-6 px-4 text-white bg-primary flex flex-col justify-center items-end border-b-2 border-gray-600">
      <div className="w-full flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="캐릭터를 검색해 보세요"
              className="flex-1 p-2 rounded-l-lg border border-gray-300 text-black focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-button text-white rounded-r-lg hover:bg-hover"
            >
              검색
            </button>
          </div>
        </form>
        <nav className="flex space-x-6 text-lg">
          <Link to="/signup">
            <button className=" rounded-md p-2 bg-button hover:bg-hover">
              Signup
            </button>
          </Link>
          <Link to="/Rank">
            <button className=" rounded-md p-2 bg-button hover:bg-hover">
              Rank
            </button>
          </Link>
          <Link to="/Wordcloud">
            <button className=" rounded-md p-2 bg-button hover:bg-hover">
              Wordcloud
            </button>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Upperbar;
