import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentModal from '../Components/CommentModal';
import { Link } from 'react-router-dom';
const HeartIcon = ({ isLiked, onClick, likeCount }) => (
  <div className="flex items-center space-x-2">
      <svg
          onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              if (onClick) onClick(e);  // Ensure onClick is defined before calling it
          }}
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


const KiyimlarB = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          axios.get('https://shoop-9wre.onrender.com/kiyimlarbuyurtmalari'),
          axios.get('https://shoop-9wre.onrender.com/users'),
        ]);
        const posts = postsResponse.data;
        setData(posts);
        setUsers(usersResponse.data);

        const currentUser = usersResponse.data.find(u => u.email === loggedInUser?.email);
        if (currentUser) {
          const initialLikedStates = {};
          posts.forEach(post => {
            initialLikedStates[post.id] = currentUser.likedItems?.includes(post.id) || false;
          });
          setLikedStates(initialLikedStates);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [loggedInUser]);

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

    // Initialize likedItems if not present
    const likedItems = user.likedItems || [];
    const isProductLiked = likedItems.includes(item.id);
    const updatedLikedItems = isProductLiked
      ? likedItems.filter((i) => i !== item.id)
      : [...likedItems, item.id];

    const updatedUser = { ...user, likedItems: updatedLikedItems };
    const updatedItem = { ...item, likeCount: isProductLiked ? item.likeCount - 1 : item.likeCount + 1 };

    try {
      // Update both user and item data
      await Promise.all([
        axios.put(`https://shoop-9wre.onrender.com/users/${user.id}`, updatedUser),
        axios.put(`https://shoop-9wre.onrender.com/kiyimlarbuyurtmalari/${item.id}`, updatedItem)
      ]);

      // Update local states
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.email === loggedInUser.email ? updatedUser : u))
      );
      setData((prevData) =>
        prevData.map((p) => (p.id === item.id ? updatedItem : p))
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
      <div className="w-[75%] mx-auto flex flex-wrap gap-6 mt-10 p-10 border rounded-xl shadow-lg bg-gradient-to-br from-orange-100 via-orange-200 to-orange-50">
        {data.length === 0 ? (
          <p className="text-center text-orange-600 text-lg font-poppins">
            Hozircha hech qanday mahsulot yo'q.
          </p>
        ) : (
          data.map((item) => {
            const user = loggedInUser ? users.find((user) => user.email === loggedInUser.email) : null;
            const isLiked = user?.likedItems?.includes(item.id);

            return (
              <div
                key={item.id}
                className="mb-5 p-2 w-96 border flex flex-col justify-between rounded-lg shadow-lg bg-white cursor-pointer transition-transform transform hover:scale-105 font-poppins"
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
                  <p className="text-sm text-gray-500 font-semibold ml-4 mt-3">
                    Buyurtma berilgan vaqt: {item.submittedAt}
                  </p>
                  <h3 className="text-2xl font-semibold text-orange-600 mt-3 ml-4">{item.nomi}</h3>
                  <p className="text-lg text-gray-600 font-semibold ml-4 mt-3">Tavsif: {item.tafsiv}</p>
                  <p className="text-lg text-gray-900 font-semibold ml-4 mt-3">Budjet: {item.budjet}</p>
                  <p className="text-lg text-gray-900 font-semibold ml-4 mt-3">Qachongacha: {item.qachongacha}</p>
                </Link>
                <HeartIcon
                  isLiked={isLiked}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleLikeToggle(item);  // Ensure the like toggle is called with the correct product
                  }}
                  likeCount={item.likeCount}
                />

              </div>
            );
          })
        )}
      </div>
      {modalOpen && selectedProduct && (
        <CommentModal
          product={selectedProduct}
          comments={comments}
          onClose={handleCloseModal}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
};

export default KiyimlarB;
