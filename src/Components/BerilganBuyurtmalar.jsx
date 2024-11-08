import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import axios from "axios";
import Torbuyurtmalari from "../Buyurtma/TortBuyurtmasi";
import KiyimlarB from "../Buyurtma/KiyimlarBuyurtmasi";
import QolMehnatiB from "../Buyurtma/QolMehnatiBuyurtmasi";
import { useTranslation } from 'react-i18next';
const HeartIcon = ({ isLiked, onClick }) => (
    <svg
        onClick={onClick}
        className={`w-8 h-8 fill-current transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 cursor-pointer`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);
function BerilganBuyurtmalar({ loggedInUser }) {
    const { t } = useTranslation(); // i18next dan foydalanish
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [categoriesVisible, setCategoriesVisible] = useState(true);

    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([]);
            setCategoriesVisible(true);
        } else {
            setCategoriesVisible(false);
            handleSearch();
        }
    }, [searchQuery]);

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const endpoints = ['kiyimlarbuyurtmalari', 'qolmehnatibuyurtmalari', 'tortbuyurtmalari'];
            const promises = endpoints.map(async (endpoint) => {
                const response = await axios.get(`https://shoop-9wre.onrender.com/${endpoint}`);
                return response.data.filter(item => item.nomi.toLowerCase().includes(searchQuery.toLowerCase()));
            });

            const results = await Promise.all(promises);
            setSearchResults(results.flat());
        } catch (error) {
            console.error('Qidiruvda xatolik yuz berdi:', error);
        }
    };

    const handleBackToCategories = () => {
        setSearchQuery('');
        setSearchResults([]);
        setCategoriesVisible(true);
    };

   

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-orange-700 text-white p-4 shadow-md">
                <h1 className="text-4xl font-bold">{t('Asosiy Bo\'lim')}</h1>
            </header>
            <nav className="bg-white p-4 shadow-md mb-6">
                <div className="mb-4 flex gap-6 items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('Qidirish...')}
                        className="w-full max-w-lg p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleBackToCategories}
                            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            {t('Categoriyalarga qaytish')}
                        </button>
                    )}
                </div>
                {!searchQuery && categoriesVisible && (
                    <div className="container mx-auto flex gap-28 justify-center mb-7 mt-7">
                        <Link
                            to="tortbuyurtmalari"
                            className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors flex flex-col items-center gap-6"
                        >
                            <div className="w-52 h-52 rounded-full bg-orange-300 p-12">
                                <img src="https://www.pngall.com/wp-content/uploads/5/Cake-PNG-Free-Download.png" alt="Tortlar" />
                            </div>
                            {t('To\'rtlar')}
                        </Link>
                        <Link
                            to="kiyimlarbuyurtmalari"
                            className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors flex flex-col items-center gap-6"
                        >
                            <div className="w-52 h-52 rounded-full bg-orange-300 p-12">
                                <img src="https://cdn.pixabay.com/photo/2017/09/29/09/38/black-2798506_960_720.png" alt="Kiyimlar" />
                            </div>
                            {t('Kiyimlar')}
                        </Link>
                        <Link
                            to="qolmehnatlaribuyurtmalari"
                            className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors flex flex-col items-center gap-6"
                        >
                            <div className="w-52 h-52 rounded-full bg-orange-300 p-8">
                                <img src="https://indi-craft.com/wp-content/uploads/2020/03/Indi_Craft.png" alt="Qo'lmehnatlari" />
                            </div>
                            {t('Qo\'lmehnatlari')}
                        </Link>
                    </div>
                )}
                {searchQuery && (
                    <div className="container mx-auto p-4">
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((item, index) => (
                                     <Link
                                     key={item.id}
                                     to={`/cart/${item.id}`}
                                     className="mb-5 p-2 w-96 border flex flex-col justify-between rounded-lg shadow-lg bg-white cursor-pointer transition-transform transform hover:scale-105 font-poppins"
                                     onClick={() => handleCardClick(item)}
                                   >
                                        {item.rasm && (
                                            <img
                                                src={item.rasm.startsWith('http') ? item.rasm : `data:image/jpeg;base64,${item.rasm}`}
                                                alt={item.nomi}
                                                className="w-full h-72 object-cover rounded-t-lg"
                                            />
                                        )}
                                        <div className="p-4">
                                            <p className="text-sm text-gray-500 font-semibold">Vaqti: {item.submittedAt}</p>
                                            <h3 className="text-xl font-semibold text-orange-600 mt-2">{item.nomi}</h3>
                                            <p className="text-lg text-gray-600 mt-2">Tavsif: {item.tafsiv}</p>
                                            <p className="text-lg text-gray-900 mt-2">Budjet: {item.budjet}</p>
                                            <p className="text-lg text-gray-900 mt-2">qachongacha: {item.qachongacha}</p>
                                            <p className="text-lg text-gray-600 mt-2">Telefon: {item.telefon}</p>
                                            <div className="mt-4 flex justify-between items-center">
                                                <HeartIcon
                                                    isLiked={false} // Yoki haqiqiy holatga qarab `true` yoki `false`
                                                    onClick={() => console.log('Like button clicked')}
                                                />

                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">Hech qanday ma'lumot topilmadi.</p>
                        )}
                    </div>
                )}
            </nav>
            {!searchQuery && categoriesVisible && (
                <main className="container mx-auto p-4">
                    <Routes>
                        <Route path="tortbuyurtmalari" element={<Torbuyurtmalari loggedInUser={loggedInUser} />} />
                        <Route path="kiyimlarbuyurtmalari" element={<KiyimlarB loggedInUser={loggedInUser} />} />
                        <Route path="qolmehnatlaribuyurtmalari" element={<QolMehnatiB loggedInUser={loggedInUser} />} />
                    </Routes>

                </main>
            )}
        </div>
    );
}

export default BerilganBuyurtmalar;
