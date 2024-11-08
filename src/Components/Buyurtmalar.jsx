import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Buyurtmalar() {
    const { t } = useTranslation(); // i18next dan tarjimalarni olish uchun hook
    const [category, setCategory] = useState('');
    const [formData, setFormData] = useState({
        nomi: '',
        tafsiv: '',
        budjet: '',
        telefon: '',
        qachongacha: '',
        manzil: ''
    });
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [submissionLimit, setSubmissionLimit] = useState(3); 
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const savedLoggedInUser = localStorage.getItem('loggedInUser');
        if (savedLoggedInUser) {
            const user = JSON.parse(savedLoggedInUser);
            setLoggedInUser(user);
            fetchUserData(user.email); 
        }
    }, []);

    const fetchUserData = async (email) => {
        try {
            const response = await axios.get(`https://shoop-9wre.onrender.com/users?email=${email}`);
            const userData = response.data[0];
            setSubmissionLimit(userData.submissionLimit || 3); 
        } catch (error) {
            console.error('Xatolik yuz berdi:', error);
        }
    };

    const fetchUserSubmissions = async () => {
        if (loggedInUser) {
            try {
                const response = await axios.get('https://shoop-9wre.onrender.com/barchabuyurtmalar');
                const allSubmissions = response.data;
                const userSubmissions = allSubmissions.filter(submission => submission.email === loggedInUser.email);
                return userSubmissions.length;
            } catch (error) {
                console.error('Xatolik yuz berdi:', error);
                return 0;
            }
        }
        return 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const getTashkentTime = () => {
        const options = {
            timeZone: 'Asia/Tashkent',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const formatter = new Intl.DateTimeFormat([], options);
        return formatter.format(new Date());
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nomi) newErrors.nomi = t('Nomi to\'ldirilishi kerak');
        if (!formData.tafsiv) newErrors.tafsiv = t('Tavsif to\'ldirilishi kerak');
        if (!formData.budjet) newErrors.budjet = t('Budjet to\'ldirilishi kerak');
        if (!formData.telefon) newErrors.telefon = t('Telefon raqam to\'ldirilishi kerak');
        if (!formData.manzil) newErrors.manzil = t('Manzil to\'ldirilishi kerak');
        if (!category) newErrors.category = t('Kategoriya tanlanishi kerak');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateUniqueId = () => {
        return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const submissionsCount = await fetchUserSubmissions();
        if (submissionsCount >= submissionLimit) {
            navigate('/hisob/premium');
            return;
        }

        if (!loggedInUser || !loggedInUser.email) {
            alert(t("O'zingizni tasdiqlash uchun emailga kirmadingiz."));
            return;
        }
    
        if (category) {
            const currentTime = getTashkentTime();
            const uniqueId = generateUniqueId();
            const dataToSend = {
                ...formData,
                email: loggedInUser?.email || '',
                submittedAt: currentTime,
                id: uniqueId
            };
    
            try {
                console.log(t('Post qilishga urinish:'), dataToSend);

                const response1 = await axios.post(`https://shoop-9wre.onrender.com/${category}`, dataToSend);
                console.log(t('Birinchi so\'rov muvaffaqiyatli:'), response1.data);
            
                const response2 = await axios.post('https://shoop-9wre.onrender.com/barchabuyurtmalar', dataToSend);
                console.log(t('Ikkinchi so\'rov muvaffaqiyatli:'), response2.data);
            
                alert(t('Ma\'lumot muvaffaqiyatli yuborildi!'));
            } catch (error) {
                console.error(t('Xatolik yuz berdi:'), error);
            }
            
        } else {
            alert(t('Iltimos, kategoriya tanlang!'));
        }
    };

    return (
        <div className='bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 p-8 shavkat'>
            <div className="w-full max-w-lg bg-white mx-auto p-8 border rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">{t('Buyurtmalar Qo\'shish')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Kategoriya')}:</label>
                        <select value={category} onChange={handleCategoryChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500' : 'focus:ring-orange-500'}`}>
                            <option value="">{t('Mahsulot yo\'nalishini tanlang')}</option>
                            <option value="TortBuyurtmalari">{t('TortBuyurtmalari')}</option>
                            <option value="QolMehnatiBuyurtmalari">{t('QolMehnatiBuyurtmalari')}</option>
                            <option value="KiyimlarBuyurtmalari">{t('KiyimlarBuyurtmalari')}</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Nomi')}:</label>
                        <input type="text" name="nomi" value={formData.nomi} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.nomi ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.nomi && <p className="text-red-500 text-sm mt-1">{errors.nomi}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Tavsif')}:</label>
                        <textarea name="tafsiv" value={formData.tafsiv} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.tafsiv ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.tafsiv && <p className="text-red-500 text-sm mt-1">{errors.tafsiv}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Budjet')}:</label>
                        <input type="text" name="budjet" value={formData.budjet} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.budjet ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.budjet && <p className="text-red-500 text-sm mt-1">{errors.budjet}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Telefon raqam')}:</label>
                        <input type="text" name="telefon" value={formData.telefon} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.telefon ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.telefon && <p className="text-red-500 text-sm mt-1">{errors.telefon}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Manzil')}:</label>
                        <input type="text" name="manzil" value={formData.manzil} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.manzil ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.manzil && <p className="text-red-500 text-sm mt-1">{errors.manzil}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('Qachongacha')}:</label>
                        <input type="date" name="qachongacha" value={formData.qachongacha} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.qachongacha ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.qachongacha && <p className="text-red-500 text-sm mt-1">{errors.qachongacha}</p>}
                    </div>
                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300">{t('Yuborish')}</button>
                </form>
            </div>
        </div>
    );
}

export default Buyurtmalar;
