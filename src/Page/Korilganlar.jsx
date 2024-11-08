import React, { useEffect, useState } from 'react';

const HeartIcon = ({ isLiked, onClick }) => (
    <svg
        onClick={onClick}
        className={`w-6 h-6 fill-current ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 cursor-pointer`}
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

const Korilganlar = () => {
    const [viewedItems, setViewedItems] = useState([]);
    const [fullItemsData, setFullItemsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    useEffect(() => {
        const fetchViewedItems = async () => {
            try {
                const response = await fetch('https://shoop-9wre.onrender.com/users');
                const users = await response.json();
                const user = users.find(user => user.email === loggedInUser.email);

                if (user) {
                    setViewedItems(user.viewedItems || []);
                } else {
                    console.warn('User not found:', loggedInUser);
                }
            } catch (error) {
                console.error('Error fetching viewed items:', error);
            }
        };

        const fetchFullItemsData = async () => {
            try {
                const response = await fetch('https://shoop-9wre.onrender.com/BarchaElonlar');
                const allItems = await response.json();
                const fullItems = allItems.filter(item => viewedItems.some(viewedItem => viewedItem.id === item.id));
                setFullItemsData(fullItems);
            } catch (error) {
                console.error('Error fetching full items data:', error);
            }
        };

        if (loggedInUser) {
            fetchViewedItems();
        }
    }, [loggedInUser, viewedItems]);

    useEffect(() => {
        if (viewedItems.length > 0) {
            fetchFullItemsData();
        }
    }, [viewedItems]);

    const deleteItem = async (itemId) => {
        try {
            const response = await fetch('https://shoop-9wre.onrender.com/users');
            const users = await response.json();
            const user = users.find(user => user.email === loggedInUser.email);

            if (user) {
                const updatedViewedItems = user.viewedItems.filter(item => item.id !== itemId);

                await fetch(`https://shoop-9wre.onrender.com/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...user,
                        viewedItems: updatedViewedItems,
                    }),
                });

                setViewedItems(updatedViewedItems);
            } else {
                console.warn('User not found for update:', loggedInUser);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 m-8">
            <h1 className="text-3xl ml-16 font-bold mb-4">Viewed Items</h1>
            {fullItemsData.length === 0 ? (
                <p>You have not viewed any items yet.</p>
            ) : (
                <div className="grid ml-16 mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fullItemsData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col w-80 relative"
                        >
                            <div className="relative">
                                {item.rasm && (
                                    <img
                                        src={item.rasm.startsWith('http') ? item.rasm : `data:image/jpeg;base64,${item.rasm}`}
                                        alt={item.nomi}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                            <div className="mt-4">
                                <h2 className="text-xl font-bold mb-1 text-orange-600">{item.nomi}</h2>
                                <p className="text-gray-600 mb-1">{item.soha}</p>
                                <p className="text-gray-500 mb-1">{item.manzil} - {item.submittedAt ? item.submittedAt.split(',')[1] : 'Noma\'lum vaqt'}</p>
                            </div>
                            <div className='flex items-center justify-between p-1'> 
                                <p className="text-gray-700 text-xl font-semibold mb-2">{item.narx}</p>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Korilganlar;
