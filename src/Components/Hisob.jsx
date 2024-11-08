import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Balans from "../Page/Balans";
import Premium from "../Page/Premium";
import { useTranslation } from "react-i18next";

function Hisob({ loggedInUser }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-700 text-white p-4 shadow-md">
        <h1 className="text-4xl font-bold">{t('hisobBoʻlimi')}</h1>
      </header>
      <nav className="bg-white p-4 shadow-md mb-6">
        <div className="container mx-auto flex justify-around">
          <Link
            to="balans"
            className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors"
          >
            {t('balans')}
          </Link>
          <Link
            to="premium"
            className="text-2xl font-semibold text-orange-600 hover:text-orange-800 transition-colors"
          >
            {t('premium')}
          </Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="balans" element={<Balans loggedInUser={loggedInUser} />} />
          <Route path="premium" element={<Premium loggedInUser={loggedInUser} />} />
        </Routes>
      </main>
    </div>
  );
}

export default Hisob;
