import React from 'react';
import axios from 'axios'; // Import axios

function Balans({ loggedInUser }) {
  const [balance, setBalance] = React.useState(0);

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (loggedInUser) {
        try {
          const response = await axios.get(`https://shoop-9wre.onrender.com/users/${loggedInUser.id}`);
          setBalance(response.data.likeCount || 0);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [loggedInUser]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-orange-700 mb-4">Balans Ma'lumotlari</h2>
      <p className="text-lg text-gray-700">Sizning balansingiz: <span className="font-semibold text-orange-600">{balance} Tanga</span></p>
    </div>
  );
}

export default Balans;
