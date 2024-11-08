import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CommentModal from './CommentModal';

const HeartIcon = ({ isLiked, onClick, likeCount }) => (
  <div className="flex items-center space-x-2">
    <svg
      onClick={onClick}
      className={`w-8 h-8 fill-current transition-colors duration-300 ${
        isLiked ? 'text-red-500' : 'text-gray-400'
      } hover:text-red-500 cursor-pointer`}
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
    {likeCount > 0 && (
      <span className="text-lg font-semibold text-gray-600">{likeCount}</span>
    )}
  </div>
);

const TopCard = ({ loggedInUser }) => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetching product data from multiple APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kiyimlarRes = await axios.get('https://shoop-9wre.onrender.com/kiyimlar');
        const qolMehnatiRes = await axios.get('https://shoop-9wre.onrender.com/qolmehnati');
        const tortRes = await axios.get('https://shoop-9wre.onrender.com/tort');
        
        const combinedData = [
          ...kiyimlarRes.data,
          ...qolMehnatiRes.data,
          ...tortRes.data,
        ].sort((a, b) => b.likeCount - a.likeCount); // Sort by likeCount
        
        setData(combinedData);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetching user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://shoop-9wre.onrender.com/users');
        setUsers(res.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetching comments for a selected product
  useEffect(() => {
    if (selectedProduct) {
      const fetchComments = async () => {
        try {
          const res = await axios.get(`https://shoop-9wre.onrender.com/comments?productId=${selectedProduct.id}`);
          setComments(res.data || []);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

      fetchComments();
    }
  }, [selectedProduct]);

  // Toggle like functionality
  const handleLikeToggle = async (product) => {
    if (!loggedInUser) {
      alert('Mahsulotlarni yoqtirish uchun tizimga kiring.');
      return;
    }

    const user = users.find((user) => user.email === loggedInUser.email);
    const productOwner = users.find((u) => u.email === product.email);

    if (!user || !productOwner) {
      console.error('Foydalanuvchi yoki mahsulot egasi topilmadi.');
      return;
    }

    const isProductLiked = user.likedItems?.some((item) => item.id === product.id);
    const updatedLikedItems = isProductLiked
      ? user.likedItems.filter((item) => item.id !== product.id)
      : [...(user.likedItems || []), product];

    const updatedProduct = {
      ...product,
      likeCount: (product.likeCount || 0) + (isProductLiked ? -1 : 1),
    };

    const updatedProductOwner = {
      ...productOwner,
      likeCount: (productOwner.likeCount || 0) + (isProductLiked ? -1 : 1),
    };

    const updatedUser = {
      ...user,
      likedItems: updatedLikedItems,
    };

    try {
      // Update user data
      await axios.put(`https://shoop-9wre.onrender.com/users/${user.id}`, updatedUser, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Update product data in all APIs
      await axios.put(`https://shoop-9wre.onrender.com/kiyimlar/${product.id}`, updatedProduct, {
        headers: { 'Content-Type': 'application/json' },
      });
      await axios.put(`https://shoop-9wre.onrender.com/tort/${product.id}`, updatedProduct, {
        headers: { 'Content-Type': 'application/json' },
      });
      await axios.put(`https://shoop-9wre.onrender.com/qolmehnati/${product.id}`, updatedProduct, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Update product owner's data
      await axios.put(`https://shoop-9wre.onrender.com/users/${productOwner.id}`, updatedProductOwner, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === loggedInUser.email
            ? updatedUser
            : u.email === productOwner.email
            ? updatedProductOwner
            : u
        )
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.id === product.id
            ? { ...item, likeCount: updatedProduct.likeCount }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Handling modal opening
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Handling comment submission
  const handleCommentSubmit = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  // Handling modal closing
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-8 mt-5 text-orange-700 text-center font-poppins">
        Top Cards by Likes
      </h2>
      <div className="w-[87%] mx-auto flex flex-wrap gap-6 mt-10 p-10 border rounded-xl shadow-lg bg-gradient-to-br from-orange-100 via-orange-200 to-orange-50">
        {data.length === 0 ? (
          <p className="text-center text-orange-600 text-lg font-poppins">
            Hozircha hech qanday mahsulot yo'q.
          </p>
        ) : (
          data.map((item) => {
            const user = loggedInUser ? users.find((user) => user.email === loggedInUser.email) : null;
            const isLiked = user?.likedItems?.some((likedItem) => likedItem.id === item.id);
            const likeCount = item.likeCount || 0;

            return (
              <div
                key={item.id}
                className="mb-5 w-[32%] p-2 border flex flex-col justify-between rounded-lg shadow-lg bg-white cursor-pointer transition-transform transform hover:scale-105 font-poppins"
              >
                <Link to={`/cart/${item.id}`} className="w-full">
                  {item.rasm && (
                    <img
                      src={item.rasm.startsWith('http') ? item.rasm : `data:image/jpeg;base64,${item.rasm}`}
                      alt={item.nomi}
                      className="w-[100%] h-72 object-cover rounded-t-lg"
                    />
                  )}
                  <p className="text-sm text-gray-500 font-semibold ml-4 mb-3 mt-3">Vaqti: {item.submittedAt}</p>
                  <h3 className="text-2xl font-semibold text-orange-600 ml-4">{item.nomi}</h3>
                  <p className="text-lg text-gray-600 font-semibold ml-4 mt-3">Tavsif: {item.tafsiv}</p>
                  <p className="text-lg text-gray-900 font-semibold ml-4 mt-3">Narx: {item.narx}</p>
                </Link>
                <div className="p-4">
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg text-gray-600 font-semibold">Telefon: {item.telefon}</p>
                    <HeartIcon
                      isLiked={isLiked}
                      onClick={() => handleLikeToggle(item)}
                      likeCount={likeCount}
                    />
                  </div>
                  <button
                    className="mt-2 text-sm text-orange-600 underline"
                    onClick={() => handleCardClick(item)}
                  >
                    Sharhlarni ko'rish ({comments.length})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && selectedProduct && (
        <CommentModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSubmit={handleCommentSubmit}
          comments={comments}
        />
      )}
    </div>
  );
};

export default TopCard;
