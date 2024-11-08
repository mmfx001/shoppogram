import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Like from "../Page/Like";
import Korilganlar from "../Page/Korilganlar";
import Elonlarim from "../Page/Elonlarim";


function Elonlar({ loggedInUser }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-700 text-white p-4 shadow-md">
        <h1 className="text-4xl font-bold">{t('elonlarBolim')}</h1>
      </header>
      <nav className="bg-white p-4 shadow-md mb-6">
        <div className="container mx-auto flex justify-around">
          <Link to="like" className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors">
            {t('saralanganElonlar')}
          </Link>
    
          <Link to="elonlarim" className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors">
            {t('meningElonlarim')}
          </Link>
      
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="like" element={<Like loggedInUser={loggedInUser} />} />
          <Route path="korilganlar" element={<Korilganlar loggedInUser={loggedInUser} />} />
          <Route path="elonlarim" element={<Elonlarim loggedInUser={loggedInUser} />} />
        </Routes>
      </main>
    </div>
  );
}

export default Elonlar;
