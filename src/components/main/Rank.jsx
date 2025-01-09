import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rank() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/api/characters`
        );
        setCharacters(response.data);
      } catch (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchCharacters();
  }, []);

  // Follow 값 기준으로 정렬
  const sortedCharacters = [...characters].sort((a, b) => b.follow - a.follow);
  const topThree = sortedCharacters.slice(0, 3);

  return (
    <div className="flex-1 bg-primary p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">이달의 깐부 캐릭터</h1>
      <div className="bg-sub p-6 rounded flex flex-wrap justify-evenly">
        {characters.map((character) => (
          <div key={character.char_idx} className="mb-4">
            <div className="bg-gray-700 w-60 h-60 flex items-center justify-center rounded">
              <img
                src={`${character.image}`}
                alt={character.char_name}
                style={{ width: '300px', height: '200px' }}
              />
            </div>
            <label className="block text-sm mb-1">{character.char_name}</label>
            <label className="block text-sm mb-1">
              Follow: {character.follow}
            </label>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center mt-6">
        이달의 깐부 랭크
      </h1>
      <div className="bg-sub p-6 rounded flex justify-center items-end gap-x-2">
        {topThree.map((character, index) => (
          <div
            key={character.char_idx}
            className={`flex flex-col items-center ${
              index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
            }`}
          >
            <div
              className={`bg-gray-700  ${
                index === 0
                  ? 'w-72 h-72'
                  : index === 1
                  ? 'w-60 h-60'
                  : 'w-48 h-48'
              } flex items-center justify-center rounded-lg border-4 ${
                index === 0
                  ? 'border-yellow-400'
                  : index === 1
                  ? 'border-gray-400'
                  : 'border-orange-400'
              } relative`}
            >
              <span
                className={`absolute -top-3 ${
                  index === 0
                    ? 'bg-yellow-400'
                    : index === 1
                    ? 'bg-gray-400'
                    : 'bg-orange-400'
                } text-black text-xs font-bold px-2 py-1 rounded-full`}
              >
                {index === 0 ? '🥇1등' : index === 1 ? '🥈2등' : '🥉3등'}
              </span>
              <img
                src={`${character.image}`}
                alt={character.char_name}
                style={{ width: '300px', height: '200px' }}
              />
            </div>
            <label className="block text-sm mb-1">{character.char_name}</label>
            <label className="text-sm text-gray-300">
              Follow: {character.follow}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rank;
