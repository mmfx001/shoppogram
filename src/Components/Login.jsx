import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.get('https://shoop-9wre.onrender.com/users');
            const users = response.data;
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                navigate('/');
                window.location.reload();
            } else {
                setMessage('Foydalanuvchi topilmadi');
            }
        } catch (error) {
            console.error('Xatolik:', error);
            setMessage('Tarmoq xatosi yuz berdi');
        }
    };

    const handleSignUp = async () => {
        const payload = { email, password, id: Date.now() };
        
        try {
            const response = await axios.get('https://shoop-9wre.onrender.com/users');
            const users = response.data;
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                setMessage('Bu email bilan akkount mavjud. Iltimos, boshqa email kiriting.');
                return;
            }

            await axios.post('https://shoop-9wre.onrender.com/users', payload);
            setMessage('Akkount yaratildi. Iltimos, kiring.');
        } catch (error) {
            console.error('Xatolik:', error);
            setMessage('Tarmoq xatosi yuz berdi');
        }
    };

    const toggleSignUp = () => {
        setIsSignUp(prev => !prev);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">{isSignUp ? 'Roʻyxatdan oʻtish' : 'Kirish'}</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {message && <p className={`block mb-4 ${message.includes('yaratildi') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
                <button
                    type="button"
                    onClick={isSignUp ? handleSignUp : handleLogin}
                    className={`w-full ${isSignUp ? 'bg-green-500' : 'bg-blue-500'} text-white py-3 rounded-lg hover:${isSignUp ? 'bg-green-600' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-${isSignUp ? 'green' : 'blue'}-500 focus:ring-opacity-50`}
                >
                    {isSignUp ? 'Roʻyxatdan oʻtish' : 'Kirish'}
                </button>
                <div className="flex gap-2 mt-6 justify-center">
                    <p>{isSignUp ? 'Akkountingiz bormi?' : 'Akkountingiz yoʻqmi?'}</p>
                    <button onClick={toggleSignUp} type="button" className="text-blue-600">
                        {isSignUp ? 'Kirish' : 'Roʻyxatdan oʻtish'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
