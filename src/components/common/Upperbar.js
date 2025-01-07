import React from 'react';
import { Link } from 'react-router-dom'; // Link 가져오기

const Upperbar = () => {
  return (
    <div className="w-full">
      {/* Upperbar Navigation */}
      <div className="w-full bg-gray-800 text-white shadow-md flex items-center justify-end px-4 py-2">
        <nav className="flex space-x-4">
          <Link to="/signup" className="hover:text-indigo-400">
            Signup
          </Link>
          <Link to="/signin" className="hover:text-indigo-400">
            Signin
          </Link>
          <Link to="/search" className="hover:text-indigo-400">
            Search
          </Link>
          <Link to="/rank" className="hover:text-indigo-400">
            Rank
          </Link>
          <Link to="/mypage" className="hover:text-indigo-400">
            Mypage
          </Link>
          <Link to="/wordcloud" className="hover:text-indigo-400">
            Wordcloud
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Upperbar;
