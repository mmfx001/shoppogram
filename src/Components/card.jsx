import React from 'react';

function Card({ card }) {
  return (
    <div className="border p-4 w-full shadow">
      <img src={card.rasm || card.url} alt={card.nomi} className="w-[25%] object-cover mb-4" />
      <h3 className="text-xl font-semibold">{card.nomi}</h3>
      <p>{card.tafsiv}</p>
      <p className="text-lg font-bold">{card.narx || card.naxr}</p>
    </div>
  );
}

export default Card;
