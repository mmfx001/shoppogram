import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Shopogram.png';
import { useTranslation } from 'react-i18next';

function Navbar() {
    const { t, i18n } = useTranslation();
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const userInfoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBalance = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (loggedInUser) {
                try {
                    const response = await axios.get(`https://shoop-9wre.onrender.com/users/${loggedInUser.id}`);
                    setUserBalance(response.data.likeCount || 0);
                } catch (error) {
                    console.error('User balance fetch error:', error);
                }
            }
        };

        fetchUserBalance();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userInfoRef.current && !userInfoRef.current.contains(event.target)) {
                setShowUserInfo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        navigate('/login');
    };

    const handleUserInfoClick = () => {
        setShowUserInfo(!showUserInfo);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        if (value) {
            navigate(value);
        }
    };

    return (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex-shrink-0">
                    <img className="w-32 h-32 cursor-pointer" src={logo} alt="Shopogram Logo" />
                </Link>

                <div className="flex gap-6 items-center">
                    <select
                        onChange={handleSelectChange}
                        className="text-orange-600 bg-white border border-orange-500 text-lg font-semibold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="" disabled selected>{t('Navigatsiya')}</option>
                        <option value="/berilganbuyurtmalar">{t('Berilgan Buyurtmalar')}</option>
                        <option value="/buyurtmalarberish">{t('Buyurtmalar berish')}</option>
                        <option value="/malumotlar">{t("Ma'lumotlar")}</option>
                        <option value="/elonlar">{t("E'lonlar")}</option>
                        <option value="/hisob">{t('Hisob')}</option>
                        <option value="/">{t('Uy')}</option>
                        <option value="/haqida">{t('Haqida')}</option>
                    </select>

                    <Link to="/messages" className="text-white text-xl font-semibold hover:text-orange-300 transition-colors">
                        {t('Suhbatlar')}
                    </Link>

                    <div className="flex items-center gap-4">
                        <button onClick={() => changeLanguage('uz')} className="text-white text-xl font-semibold hover:text-orange-300">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white">
                                UZ
                            </div>
                        </button>
                        <p className="text-white">|</p>
                        <button onClick={() => changeLanguage('ru')} className="text-white text-xl font-semibold hover:text-orange-300">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white">
                                RU
                            </div>
                        </button>
                    </div>

                    <Link to="/users" className="w-60 text-center bg-white text-orange-600 font-semibold py-3 px-6 rounded-lg border border-orange-500 hover:bg-orange-600 hover:text-white transition-all">
                        {t("E'lon berish")}
                    </Link>

                    {!localStorage.getItem('loggedInUser') ? (
                        <Link to="/login" className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                            <img
                                src="https://w7.pngwing.com/pngs/339/876/png-transparent-login-computer-icons-password-login-black-symbol-subscription-business-model-thumbnail.png"
                                alt="Login Icon"
                                className="w-8 h-8"
                            />
                        </Link>
                    ) : (
                        <div className="relative">
                            <div
                                className="cursor-pointer w-12 h-12 bg-white flex items-center justify-center rounded-full"
                                onClick={handleUserInfoClick}
                            >
                                <img
                                    src="https://w7.pngwing.com/pngs/339/876/png-transparent-login-computer-icons-password-login-black-symbol-subscription-business-model-thumbnail.png"
                                    alt="User Info Icon"
                                    className="w-8 h-8"
                                />
                            </div>
                            {showUserInfo && (
                                <div
                                    ref={userInfoRef}
                                    className="absolute right-0 mt-2 w-72 bg-white p-4 rounded-lg shadow-lg"
                                >
                                    <p className="font-medium text-orange-600">{t('Email')}: {JSON.parse(localStorage.getItem('loggedInUser')).email}</p>
                                    <p className="font-medium text-orange-600">ID: {JSON.parse(localStorage.getItem('loggedInUser')).id}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mt-2 w-full"
                                    >
                                        {t('Logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
