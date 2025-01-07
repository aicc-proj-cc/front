import React from 'react';
import { Link } from 'react-router-dom'; // Link 가져오기

const Upperbar = () => {
  return (
    <div className="w-full py-6 px-4 text-white bg-primary flex flex-col justify-center items-end border-b-2 border-gray-600">
      <nav className="flex space-x-6 text-lg">
        <Link to="/signup">
          <button className=" rounded-md p-2 bg-button hover:bg-hover">
            Signup
          </button>
        </Link>
        <Link to="/User">
          <button className=" rounded-md p-2 bg-button hover:bg-hover">
            User
          </button>
        </Link>
        <Link to="/Search">
          <button className=" rounded-md p-2 bg-button hover:bg-hover">
            Search
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
  );
};

export default Upperbar;
