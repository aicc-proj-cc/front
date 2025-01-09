import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/outline'; // Heroicons 사용자 아이콘 import

const Rank = () => {
  const [message, setMessage] = useState('');
  const [characters, setCharacters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('로그인이 필요합니다.');
        setIsLoggedIn(false);
        return;
      }

      try {
        const verifyResponse = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user_idx } = verifyResponse.data;

        if (!user_idx) {
          throw new Error('유효한 사용자 정보를 찾을 수 없습니다.');
        }

        setIsLoggedIn(true);
        const charactersResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/api/characters/user/${user_idx}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCharacters(charactersResponse.data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setMessage('데이터를 가져오는 중 오류가 발생했습니다.');
        setIsLoggedIn(false);
      }
    };

    fetchData();
  }, []);

  if (!isLoggedIn) {
    return <div className="text-center text-red-500 font-bold">{message}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">사용자가 생성한 캐릭터 목록</h2>
      {characters.length > 0 ? (
        <div className="grid grid-cols-5 gap-4">
          {characters.map((character) => (
            <div
              key={character.char_idx}
              className="p-2 border rounded shadow text-center"
            >
              <h3 className="text-xl font-semibold">{character.char_name}</h3>
              {character.character_image ? (
                <img
                  src={character.character_image}
                  alt={character.char_name}
                  className="w-24 h-24 object-cover mt-2 mx-auto"
                />
              ) : (
                <div className="w-24 h-24 flex justify-center items-center bg-gray-200 mt-2 mx-auto rounded">
                  <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>생성된 캐릭터가 없습니다.</p>
      )}
    </div>
  );
};

export default Rank;
