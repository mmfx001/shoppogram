import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`https://shoop-9wre.onrender.com/tort/${id}`);
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/qolmehnati/${id}`);
        }
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/qolMehnatibuyurtmalari/${id}`);
        }
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/tortbuyurtmalari/${id}`);
        }
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/kiyimlarbuyurtmalari/${id}`);
        }
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/barchabuyurtmalar/${id}`);
        }
        if (!response.ok) {
          response = await fetch(`https://shoop-9wre.onrender.com/kiyimlar/${id}`);
        }
        if (!response.ok) {
          throw new Error('Data not found');
        }
        const data = await response.json();
        setCard(data);
      } catch (error) {
        console.error('Error fetching the card data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleGoToChat = () => {
    if (card && card.email) {
      navigate(`/messages/${card.email}`); // Make sure card.email is the correct identifier
    }
  };

  const handleShowPhone = () => {
    setShowPhone(!showPhone);
  };

  return card ? (
    <div className="flex h-screen flex-col lg:flex-row w-full bg-gradient-to-r from-orange-100 to-yellow-100 p-6">
      {/* Image Section */}
      <div className="w-full lg:w-2/5 flex justify-center items-center mt-[-130px] lg:mb-0">
        <img
          src={card.rasm || card.url}
          alt=""
          className="w-full h-auto max-w-[400px] rounded-lg shadow-lg border border-orange-400"
        />
      </div>

      {/* Details Section */}
      <div className="w-full lg:w-3/5 lg:ml-6 mt-12">
        {/* Card Details */}
        <div className="border border-orange-300 p-6 bg-orange-50 rounded-xl shadow-md mb-6">
          <h4 className="text-2xl text-orange-700 font-bold mb-4">Tafsilotlari</h4>
          <div className="text-orange-700 space-y-3">
            <p><strong>Nomi:</strong> {card.nomi}</p>
            <p><strong>Narxi:</strong> {card.narx || card.naxr}</p>
            <p><strong>Soha:</strong> {card.soha}</p>
            <p><strong>Tavsif:</strong> {card.tafsiv}</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border border-orange-300 p-6 bg-orange-50 rounded-xl shadow-md mb-6">
          <h4 className="text-2xl text-orange-700 font-bold mb-4">Sotuvchi bilan bog'lanish</h4>
          <button
            onClick={handleShowPhone}
            className={`w-full py-3 px-4 rounded-md mb-4 transition-colors duration-300 ${
              showPhone
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white font-semibold`}
          >
            {showPhone ? card.telefon : 'Telefon raqamini ko‘rsatish'}
          </button>
          <button
            onClick={handleGoToChat}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-300"
          >
            Suhbatga o‘tish
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-500">Yuklanmoqda...</p>
    </div>
  );
}

export default CardDetail;
