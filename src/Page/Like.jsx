import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentModal from '../Components/CommentModal';
import { Link } from 'react-router-dom';

const HeartIcon = ({ isLiked, onClick, likeCount }) => (
  <div className="flex items-center space-x-2">
    <svg
      onClick={onClick}
      className={`w-8 h-8 fill-current transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 cursor-pointer`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    {likeCount > 0 && (
      <span className="text-lg font-semibold text-gray-600">{likeCount}</span>
    )}
  </div>
);

const Like = () => {
  const [data, setData] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch('https://shoop-9wre.onrender.com/users');
        const users = await response.json();
        const user = users.find((user) => user.email === loggedInUser.email);

        if (user) {
          setLikedItems(user.likedItems || []);
        } else {
          console.warn('User not found:', loggedInUser);
        }
      } catch (error) {
        console.error('Error fetching liked items:', error);
      }
    };

    if (loggedInUser) {
      fetchLikedItems();
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (likedItems.length > 0) {
          // Fetch the cards from BarchaElonlar based on liked item IDs
          const response = await axios.get('https://shoop-9wre.onrender.com/barchaelonlar');
          const products = response.data.filter((product) =>
            likedItems.includes(product.id) // Only include products whose IDs match liked items
          );
          setData(products);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [likedItems]);

  const handleLikeToggle = async (item) => {
    if (!loggedInUser) {
      alert('Mahsulotlarni yoqtirish uchun tizimga kiring.');
      return;
    }

    const user = users.find((user) => user.email === loggedInUser.email);
    if (!user) {
      console.error('Foydalanuvchi topilmadi.');
      return;
    }

    const isProductLiked = likedStates[item.id];
    const updatedLikedItems = isProductLiked
      ? user.likedItems.filter((i) => i !== item.id)
      : [...(user.likedItems || []), item.id];

    const updatedUser = { ...user, likedItems: updatedLikedItems };

    try {
      await Promise.all([
        axios.put(`https://shoop-9wre.onrender.com/users/${user.id}`, updatedUser),
      ]);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.email === loggedInUser.email ? updatedUser : u))
      );
      setLikedStates((prevStates) => ({
        ...prevStates,
        [item.id]: !isProductLiked,
      }));
    } catch (error) {
      console.error('Yoqtirilgan narsalarni yangilashda xatolik:', error);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    fetchComments(product.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchComments = async (productId) => {
    try {
      const response = await axios.get(`https://shoop-9wre.onrender.com/comments?productId=${productId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-8 mt-5 text-orange-700 text-center font-poppins">
        Mahsulotlar
      </h2>
      <div className="w-[87%] mx-auto flex flex-wrap gap-6 mt-10 p-10 border rounded-xl shadow-lg bg-gradient-to-br from-orange-100 via-orange-200 to-orange-50">
        {data.length === 0 ? (
          <p className="text-center text-orange-600 text-lg font-poppins">
            Hozircha hech qanday mahsulot yo'q.
          </p>
        ) : (
          data.map((item) => {
            const isLiked = likedStates[item.id];
            const likeCount = item.likeCount || 0;

            return (
              <div
                key={item.id}
                className="mb-5 w-[32%] p-2 border flex flex-col justify-between rounded-lg shadow-lg bg-white cursor-pointer transition-transform transform hover:scale-105 font-poppins"
                onClick={() => handleCardClick(item)}
              >
                <Link to={`/cart/${item.id}`} className="w-full">
                  {item.rasm && (
                    <img
                      src={item.rasm.startsWith('http') ? item.rasm : `data:image/jpeg;base64,${item.rasm}`}
                      alt={item.nomi}
                      className="w-[100%] h-72 object-cover rounded-t-lg"
                    />
                  )}
                  <p className="text-sm text-gray-500 font-semibold ml-4 mb-3 mt-3">vaqti: {item.submittedAt}</p>
                  <h3 className="text-2xl font-semibold text-orange-600 ml-4">{item.nomi}</h3>
                  <p className="text-lg text-gray-600 font-semibold ml-4 mt-3">Tavsif: {item.tafsiv}</p>
                  <p className="text-lg text-gray-900 font-semibold ml-4 mt-3">Narx: {item.narx}</p>
                </Link>
                <div className="p-4">
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg text-gray-600 font-semibold">Telefon: {item.telefon}</p>
                    <HeartIcon
                      isLiked={isLiked}
                      likeCount={likeCount}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle(item);
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                  className="bg-orange-600 text-white p-2 rounded-lg w-full mt-4 hover:bg-orange-700 transition-colors duration-300"
                >
                  Izohlar
                </button>
              </div>
            );
          })
        )}
      </div>
      <CommentModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        productId={selectedProduct?.id}
        userEmail={loggedInUser?.email}
        comments={comments}
        onCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
};

export default Like;
