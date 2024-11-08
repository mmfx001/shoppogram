import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Users() {
    const { t } = useTranslation();
    const [category, setCategory] = useState('');
    const [formData, setFormData] = useState({
        nomi: '',
        tafsiv: '',
        narx: '',
        telefon: '',
        rasm: '',
        manzil: ''
    });
    const [file, setFile] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [submissionLimit, setSubmissionLimit] = useState(3);
    const [location, setLocation] = useState(null);
    const [errors, setErrors] = useState({});
    const [imageSourceType, setImageSourceType] = useState('file'); // 'file' or 'url'
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedLoggedInUser = localStorage.getItem('loggedInUser');
        if (savedLoggedInUser) {
            const user = JSON.parse(savedLoggedInUser);
            setLoggedInUser(user);
            fetchUserData(user.email);
        }

        // Geolocation olish
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error(t('foydalanuvchilar.joylashuvXatosi'), error);
                }
            );
        }
    }, []);

    const fetchUserData = async (email) => {
        try {
            const response = await axios.get(`https://shoop-9wre.onrender.com/users?email=${email}`);
            const userData = response.data[0];
            setSubmissionLimit(userData.submissionLimit || 3); 
        } catch (error) {
            console.error(t('foydalanuvchilar.xatolik'), error);
        }
    };

    const fetchUserSubmissions = async () => {
        if (loggedInUser) {
            try {
                const response = await axios.get('https://shoop-9wre.onrender.com/barchaelonlar');
                const allSubmissions = response.data;
                const userSubmissions = allSubmissions.filter(submission => submission.email === loggedInUser.email);
                return userSubmissions.length;
            } catch (error) {
                console.error(t('foydalanuvchilar.xatolik'), error);
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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                rasm: reader.result.split(',')[1]
            });
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleImageSourceTypeChange = (e) => {
        setImageSourceType(e.target.value);
        setFormData({
            ...formData,
            rasm: ''
        });
        setFile(null);
        setImageUrl('');
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setFormData({
            ...formData,
            rasm: url
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nomi) newErrors.nomi = t('foydalanuvchilar.nomi') + ' to\'ldirilishi kerak';
        if (!formData.tafsiv) newErrors.tafsiv = t('foydalanuvchilar.tavsif') + ' to\'ldirilishi kerak';
        if (!formData.narx) newErrors.narx = t('foydalanuvchilar.narx') + ' to\'ldirilishi kerak';
        if (!formData.telefon) newErrors.telefon = t('foydalanuvchilar.telefon') + ' to\'ldirilishi kerak';
        if (!formData.manzil) newErrors.manzil = t('foydalanuvchilar.manzil') + ' to\'ldirilishi kerak';
        if (!category) newErrors.category = t('foydalanuvchilar.kategoriyaTanlanmagan');
        if (!formData.rasm) newErrors.rasm = t('foydalanuvchilar.rasmTanlanmagan'); // Check for image

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            console.error(t('foydalanuvchilar.tastiqlashEmail'));
            alert(t('foydalanuvchilar.tastiqlashEmail'));
            return;
        }
    
        if (category) {
            const currentTime = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
            const uniqueId = `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
            const dataToSend = {
                ...formData,
                email: loggedInUser?.email || '',
                submittedAt: currentTime,
                id: uniqueId,
                location: location ? `${location.latitude}, ${location.longitude}` : 'Location not available' 
            };
    
            try {
                await axios.post(`https://shoop-9wre.onrender.com/${category}`, dataToSend);
                await axios.post('https://shoop-9wre.onrender.com/barchaelonlar', dataToSend);
                alert(t('foydalanuvchilar.malumotYuborildi'));
                setFormData({
                    nomi: '',
                    tafsiv: '',
                    narx: '',
                    telefon: '',
                    rasm: '',
                    manzil: ''
                });
                setCategory('');
                setImageSourceType('file');
            } catch (error) {
                console.error(t('foydalanuvchilar.xatolik'), error);
            }
        } else {
            alert(t('foydalanuvchilar.kategoriyaTasnash'));
        }
    };

    return (
        <div className='bg-orange-100 p-8'>
            <div className="w-[70%] bg-white mx-auto p-8 border rounded-lg shadow-lg bg-gradient-to-br from-chroyli-to-orange to-orange-50">
                <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">{t('foydalanuvchilar.sarlavha')}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Other fields... */}
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.kategoriya')}</label>
                        <select value={category} onChange={handleCategoryChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.category ? 'border-red-500' : 'focus:ring-orange-500'}`}>
                            <option value="">{t('foydalanuvchilar.kategoriyaTanlash')}</option>
                            <option value="Tort">Tort</option>
                            <option value="QolMehnati">QolMehnati</option>
                            <option value="Kiyimlar">Kiyimlar</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.nomi')}</label>
                        <input type="text" name="nomi" value={formData.nomi} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.nomi ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.nomi && <p className="text-red-500 text-sm">{errors.nomi}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.tavsif')}</label>
                        <textarea name="tafsiv" value={formData.tafsiv} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.tafsiv ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.tafsiv && <p className="text-red-500 text-sm">{errors.tafsiv}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.narx')}</label>
                        <input type="text" name="narx" value={formData.narx} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.narx ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.narx && <p className="text-red-500 text-sm">{errors.narx}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.telefon')}</label>
                        <input type="tel" name="telefon" value={formData.telefon} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.telefon ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.telefon && <p className="text-red-500 text-sm">{errors.telefon}</p>}
                    </div>
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.manzil')}</label>
                        <input type="text" name="manzil" value={formData.manzil} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.manzil ? 'border-red-500' : 'focus:ring-orange-500'}`} />
                        {errors.manzil && <p className="text-red-500 text-sm">{errors.manzil}</p>}
                    </div>
                
                    
                    <div className="mb-5">
                        <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.rasmManbasi')}</label>
                        <div className="flex items-center space-x-4">
                            <label>
                                <input 
                                    type="radio" 
                                    value="file" 
                                    checked={imageSourceType === 'file'} 
                                    onChange={handleImageSourceTypeChange} 
                                /> {t('foydalanuvchilar.fayl')}
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="url" 
                                    checked={imageSourceType === 'url'} 
                                    onChange={handleImageSourceTypeChange} 
                                /> {t('foydalanuvchilar.url')}
                            </label>
                        </div>
                    </div>

                    {imageSourceType === 'file' && (
                        <div className="mb-5">
                            <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.rasm')}</label>
                            <input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                            {errors.rasm && <p className="text-red-500 text-sm">{errors.rasm}</p>}
                        </div>
                    )}

                    {imageSourceType === 'url' && (
                        <div className="mb-5">
                            <label className="block text-orange-800 font-medium text-lg mb-2">{t('foydalanuvchilar.rasmURL')}</label>
                            <input 
                                type="text" 
                                value={imageUrl} 
                                onChange={handleImageUrlChange} 
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" 
                            />
                            {errors.rasm && <p className="text-red-500 text-sm">{errors.rasm}</p>}
                        </div>
                    )}
                    
                    <button type="submit" className="w-full p-3 bg-orange-600 text-white rounded-lg text-lg font-bold hover:bg-orange-700">{t('foydalanuvchilar.yuborish')}</button>
                </form>
            </div>
        </div>
    );
}

export default Users;
