import React, { useState } from 'react';

const MalumotlarSorash = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      setLoading(true);
      setSelectedOption(selectedValue);
      setTimeout(() => {
        generateResponse(selectedValue);
        setLoading(false);
      }, 1000); // Simulate network delay
    }
  };

  const generateResponse = (option) => {
    let reply = '';
    switch (option) {
      case 'Nmalar sota olaman yoki harid qilishim mumkun':
        reply = 'Assalomu Alaykom siz bizda hozircha 3 turdagi mahsulotlar yani Tort, Kiyimlar va Qolda toyorlanga buyumlar harid qila olishingiz shu bilan birga shu narsalarni sota olishgiz ham mumkun';
        break;
      case 'yosh chegarasi bormi':
        reply = 'Ha bor, 12 yoshdan katta foydalanuvchilar uchun mo\'ljallangan, chunki 12 yoshdan kichiklar uchun kerak bo\'lmagan narsalar e\'lon qilishi yoki sotmoqchi bo\'lganlarga to\'g\'ri kelmasligi mumkin';
        break;
      case 'sizlarda kamisiya bormi':
        reply = 'Yo\'q, hozircha bizda komissiyalar mavjud emas';
        break;
      case "e'lon qilishlar qanchagacha tekin":
        reply = 'Bizda 3 ta mahsulotgacha tekin va 3 tadan ko\'p mahsulot qo\'ymoqchi bo\'lsangiz, sizdan 12,990 so\'m so\'raladi';
        break;
      default:
        reply = 'Iltimos, variantni tanlang va javob oling.';
    }

    setChats((prevChats) => [
      ...prevChats,
      { type: 'user', text: option },
      { type: 'response', text: reply },
    ]);
    setSelectedOption('');
  };

  return (
    <div className='w-full bg-orange-100'>
        
    <div className="flex flex-col h-[85vh] p-4 bg-gray-100 rounded shadow-md w-[80%] mt-2 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Malumotlar Sorash</h2>

      <div className="flex-grow overflow-y-auto bg-white p-4 rounded shadow-md mb-4">
        {chats.map((chat, index) => (
          <div key={index}>
            {chat.type === 'response' && (
              <div className="flex mb-2 justify-start">
                <div className="p-3 rounded-lg bg-gray-300 text-gray-900 max-w-full md:max-w-[500px]">
                  {chat.text}
                </div>
              </div>
            )}
            {chat.type === 'user' && (
              <div className="flex mb-4 justify-end">
                <div className="p-3 rounded-lg bg-orange-500 text-white max-w-full md:max-w-[400px]">
                  {chat.text}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-orange-500"></div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <select
          className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="">Nima so'rashingizni tanlang</option>
          <option value="Nmalar sota olaman yoki harid qilishim mumkun">Nmalar sota olaman yoki harid qilishim mumkun</option>
          <option value="yosh chegarasi bormi">Yosh chegarasi bormi</option>
          <option value="e'lon qilishlar qanchagacha tekin">E'lon qilishlar qanchagacha tekin</option>
          <option value="sizlarda kamisiya bormi">Sizlarda kamisiya bormi</option>
        </select>
      </div>
    </div>
    </div>
  );
};

export default MalumotlarSorash;
