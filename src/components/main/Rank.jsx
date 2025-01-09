import React, { useState, useEffect } from 'react';

const Rank = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/characters/');
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {characters.map((char) => (
        <div
          key={char.char_idx}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-sm font-semibold mb-2">{char.char_name}</h2>
          {char.character_image && (
            <img
              src={char.character_image}
              alt={char.char_name}
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Rank;
