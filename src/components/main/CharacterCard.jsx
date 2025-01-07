import React from 'react';

const CharacterCard = ({ card, index, onClick }) => {
  // console.log("card : ", card);
  return (
    <div key={index} className="character-card" onClick={onClick}>
      <img
        src={card.character_image}
        alt={card.char_name}
        className="character-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/default-avatar.png';
        }}
      />
      <div className="character-info">
        <h2 className="character-name">{card.char_name}</h2>
        <p className="character-description">{card.char_description}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
