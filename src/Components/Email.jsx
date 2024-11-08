import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmailList = ({ onUserClick, selectedUser }) => {
    const [usersWithMessages, setUsersWithMessages] = useState([]); // Xabar almashgan foydalanuvchilar
    const [allUsers, setAllUsers] = useState([]); // Barcha foydalanuvchilar
    const [searchQueryMessages, setSearchQueryMessages] = useState(''); // Xabarlar bo'yicha qidirish
    const [searchQueryAllUsers, setSearchQueryAllUsers] = useState(''); // Barcha foydalanuvchilar uchun qidirish
    const [loading, setLoading] = useState(true);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const navigate = useNavigate(); // <-- Initialize navigate hook

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            fetchMessages();
        }
    }, [loggedInUser]);

    const fetchMessages = () => {
        axios.get('https://insta-lvyt.onrender.com/messages')
            .then(response => {
                const messages = response.data;
                const filteredUsers = messages
                    .filter(msg => msg.sender === loggedInUser.email || msg.receiver === loggedInUser.email)
                    .map(msg => msg.sender === loggedInUser.email ? msg.receiver : msg.sender)
                    .filter((email, index, self) => self.indexOf(email) === index); // Takrorlanuvchilarni olib tashlash

                setUsersWithMessages(allUsers.filter(user => filteredUsers.includes(user.email)));
            })
            .catch(error => console.error("Xabarlarni olishda xato:", error));
    };

    const fetchUsers = () => {
        axios.get('https://shoop-9wre.onrender.com/users')
            .then(response => {
                setAllUsers(response.data);
                setLoading(false);
                fetchMessages(); // Foydalanuvchilarni yuklagandan so'ng, xabarlarni yuklang
            })
            .catch(error => {
                console.error("Foydalanuvchilarni olishda xato:", error);
                setLoading(false);
            });
    };

    // Foydalanuvchilarni xabarlar bo'yicha filtrlash
    const getFilteredUsersByMessages = () => {
        return usersWithMessages.filter(user => 
            user.email.toLowerCase().includes(searchQueryMessages.toLowerCase())
        );
    };

    // Barcha foydalanuvchilarni filtrlash
    const getFilteredAllUsers = () => {
        return allUsers.filter(user => 
            user.email.toLowerCase().includes(searchQueryAllUsers.toLowerCase())
        );
    };

    const handleUserClick = (user) => {
        onUserClick(user);
    };

    const handleBackClick = () => {
        navigate('/'); // <-- Use navigate to redirect
    };

    return (
        <div className="md:w-1/3 w-full border-r border-gray-300 h-[80vh] bg-white flex flex-col">
            <button onClick={handleBackClick} className="text-2xl mr-4 text-orange-500 p-4 hover:text-orange-700 transition-all duration-200">← HOME</button>
            
            {/* Barcha foydalanuvchilarni qidirish */}
            <input
                type="text"
                placeholder="Barcha foydalanuvchilarni qidirish... "
                className="p-3 m-4 rounded-full border border-gray-300 bg-orange-500 text-white placeholder-gray-50 placeholder:font-bold px-5 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition duration-200 ease-in-out hover:bg-orange-600"
                value={searchQueryAllUsers}
                onChange={(e) => setSearchQueryAllUsers(e.target.value)}
            />
            
            {/* Xabarlar bo'yicha qidirish */}
            <input
                type="text"
                placeholder="Xabarlar bo'yicha qidirish..."
                className="p-3 m-4 rounded-full border border-gray-300 bg-orange-500 text-white placeholder-gray-50 placeholder:font-bold px-5 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition duration-200 ease-in-out hover:bg-orange-600"
                value={searchQueryMessages}
                onChange={(e) => {
                    setSearchQueryMessages(e.target.value);
                    fetchMessages(); // Qidiruv o'zgarganda xabarlarni qayta yuklang
                }}
            />
            
            <div className="flex-grow overflow-y-auto">
                {loading ? (
                    <div className="animate-pulse space-y-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center py-3 px-4 bg-gray-200 text-gray-600">
                                <div className="rounded-full bg-gray-400 h-8 w-8 mr-2"></div>
                                <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Barcha foydalanuvchilarni qidirish */}
                        {searchQueryAllUsers && getFilteredAllUsers().map(user => (
                            <div
                                key={user.email}
                                className={`flex items-center py-3 px-4 cursor-pointer transition-all duration-200 ease-in-out 
                                ${selectedUser === user.email ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 text-black'}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <FaUserCircle className="text-gray-400 mr-2 text-2xl" />
                                <span className="font-medium">{user.email}</span>
                            </div>
                        ))}

                        {/* Xabarlar bo'yicha filtrlash */}
                        {getFilteredUsersByMessages().map(user => (
                            <div
                                key={user.email}
                                className={`flex items-center py-3 px-4 cursor-pointer transition-all duration-200 ease-in-out 
                                ${selectedUser === user.email ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 text-black'}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <FaUserCircle className="text-gray-400 mr-2 text-2xl" />
                                <span className="font-medium">{user.email}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailList;
