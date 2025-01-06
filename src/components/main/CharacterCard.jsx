import React from 'react'

const CharacterCard = ({card, index}) => {
  // console.log("card : ", card);
  return (
    <div key={index} className="character-card">
      <img
        src={card.image} // 캐릭터 이미지
        alt={card.name} 
        className="character-image"
      />
      <div className="character-info">
        {/* 캐릭터 이름 */}
        <h2 className="character-name">{card.name}</h2>
        {/* 캐릭터 설명 */}
        <p className="character-description">{card.description}</p> 
      </div>
  </div>
  )
}

export default CharacterCard