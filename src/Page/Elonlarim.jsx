import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Elonlarim() {
    const [userElonlar, setUserElonlar] = useState([]);
    const [editingElon, setEditingElon] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const { t } = useTranslation();
    const navigate = useNavigate();

    const loggedInUserEmail = JSON.parse(localStorage.getItem('loggedInUser'))?.email;

    useEffect(() => {
        if (loggedInUserEmail) {
            fetchUserElonlar(loggedInUserEmail);
        }
    }, [loggedInUserEmail]);

    const fetchUserElonlar = async (email) => {
        try {
            const endpoints = [
                'hhttps://shoop-9wre.onrender.com/kiyimlar',
                'https://shoop-9wre.onrender.com/qolmehnati',
                'https://shoop-9wre.onrender.com/tort',
                'https://shoop-9wre.onrender.com/barchaelonlar'
            ];
            const responses = await Promise.all(endpoints.map(url => axios.get(url)));
            const allElonlar = responses.flatMap(response => response.data);

            // Deduplicate by ID
            const uniqueElonlar = Array.from(new Map(allElonlar.map(elon => [elon.id, elon])).values())
                                      .filter(elon => elon.email === email);

            setUserElonlar(uniqueElonlar);
        } catch (error) {
            console.error(t('error.olish'), error);
        }
    };

    const handleEdit = (elon) => {
        setEditingElon(elon);
        setUpdatedData({ ...elon });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingElon) return;
    
        try {
            const endpoints = [
                'https://shoop-9wre.onrender.com/kiyimlar',
                'https://shoop-9wre.onrender.com/qolmehnati',
                'https://shoop-9wre.onrender.com/tort',
                'https://shoop-9wre.onrender.com/barchaelonlar'
            ];
    
            await Promise.all(endpoints.map(url =>
                axios.patch(`${url}/${editingElon.id}`, updatedData)
                    .catch(error => {
                        console.error(`Failed to update ${url}:`, error);
                    })
            ));
    
            fetchUserElonlar(loggedInUserEmail);
            setEditingElon(null);
            setUpdatedData({});
            alert(t('alert.yangilashMuvaffaqiyat'));
        } catch (error) {
            console.error(t('error.yangilash'), error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const endpoints = [
                'https://shoop-9wre.onrender.com/kiyimlar',
                'https://shoop-9wre.onrender.com/qolmehnati',
                'https://shoop-9wre.onrender.com/Tort',
                'https://shoop-9wre.onrender.com/barchaelonlar'
            ];
    
            await Promise.all(endpoints.map(url =>
                axios.delete(`${url}/${id}`)
                    .catch(error => {
                        console.error(`Failed to delete ${url}:`, error);
                    })
            ));
            
            fetchUserElonlar(loggedInUserEmail);
            setEditingElon(null);
            setUpdatedData({});
            alert(t('alert.ochirishMuvaffaqiyat'));
        } catch (error) {
            console.error(t('error.ochirish'), error);
        }
    };
    
    const handleChange = (e) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = () => {
        setEditingElon(null);
        setUpdatedData({});
    };

    return (
        <div className="bg-orange-100 p-8">
            <div className="w-[80%] bg-white mx-auto p-8 border rounded-lg shadow-lg bg-gradient-to-br from-chroyli-to-orange to-orange-50">
                <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">{t('sahifaNom')}</h2>
                <div className="space-y-6">
                    {userElonlar.map(elon => (
                        <div key={elon.id} className="p-4 border rounded-lg shadow-md bg-white relative w-96">
                            <h3 className="text-xl font-semibold mb-2 text-orange-800">{elon.nomi}</h3>
                            <p className="mb-2 text-gray-700">{t('tavsif')}: {elon.tafsiv}</p>
                            <p className="mb-2 text-gray-700">{t('narx')}: {elon.narx}</p>
                            <p className="mb-2 text-gray-700">{t('telefon')}: {elon.telefon}</p>
                            <p className="mb-2 text-gray-700">{t('manzil')}: {elon.manzil}</p>
                  
                            <img
                                src={elon.rasm.startsWith('http') ? elon.rasm : `data:image/jpeg;base64,${elon.rasm}`}
                                alt={elon.nomi}
                                className="w-60 h-52 object-cover rounded-t-lg"
                            />
             
                            <div className="space-x-2 mt-7">
                                <button onClick={() => handleEdit(elon)} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700">{t('tahrirlash')}</button>
                                <button onClick={() => handleDelete(elon.id)} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">{t('ochirish')}</button>
                            </div>

                            {editingElon && editingElon.id === elon.id && (
                                <form onSubmit={handleUpdate} className="mt-4 p-4 bg-gray-100 border rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold mb-4 text-orange-700">{t('tahrirlash')}</h3>
                                    <div className="mb-4">
                                        <label className="block text-orange-800 font-medium mb-2">{t('nomi')}:</label>
                                        <input type="text" name="nomi" value={updatedData.nomi || ''} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-orange-800 font-medium mb-2">{t('tavsif')}:</label>
                                        <input type="text" name="tafsiv" value={updatedData.tafsiv || ''} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-orange-800 font-medium mb-2">{t('narx')}:</label>
                                        <input type="text" name="narx" value={updatedData.narx || ''} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-orange-800 font-medium mb-2">{t('telefon')}:</label>
                                        <input type="text" name="telefon" value={updatedData.telefon || ''} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-orange-800 font-medium mb-2">{t('manzil')}:</label>
                                        <input type="text" name="manzil" value={updatedData.manzil || ''} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="flex justify-between">
                                        <button type="submit" className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700">{t('yangilash')}</button>
                                        <button type="button" onClick={handleClose} className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700">{t('yopish')}</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Elonlarim;
