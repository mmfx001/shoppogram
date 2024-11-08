import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Premium({ loggedInUser, onLimitUpdated }) {
  const { t } = useTranslation();
  const [likeCount, setLikeCount] = useState(0);
  const [submissionLimit, setSubmissionLimit] = useState(3);

  useEffect(() => {
    if (loggedInUser) {
      fetchUserData(loggedInUser.email);
    }
  }, [loggedInUser]);

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`https://shoop-9wre.onrender.com/users?email=${email}`);
      const userData = response.data[0];
      setLikeCount(userData.likeCount || 0);
      setSubmissionLimit(userData.submissionLimit || 3);
    } catch (error) {
      console.error(t('errors.fetch'), error);
    }
  };

  const handleUpgrade = async (additionalLimit, cost) => {
    if (likeCount >= cost) {
      const newLikeCount = likeCount - cost;
      const newSubmissionLimit = submissionLimit + additionalLimit;

      try {
        await axios.patch(`https://shoop-9wre.onrender.com/users/${loggedInUser.id}`, {
          likeCount: newLikeCount,
          submissionLimit: newSubmissionLimit
        });

        setLikeCount(newLikeCount);
        setSubmissionLimit(newSubmissionLimit);

        if (onLimitUpdated) onLimitUpdated(newSubmissionLimit);

        alert(t('errors.update_success'));
      } catch (error) {
        console.error(t('errors.fetch'), error);
      }
    } else {
      alert(t('errors.insufficient_like_count'));
    }
  };

  return (
    <div className="bg-orange-100 p-8">
      <div className="w-[70%] bg-white mx-auto p-8 border rounded-lg shadow-lg flex flex-col gap-5">
        <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">{t('premium.title')}</h2>
        
        <button
          onClick={() => handleUpgrade(6, 6)}
          className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
        >
          {t('premium.button_limit_6')}
        </button>

        <button
          onClick={() => handleUpgrade(15, 15)}
          className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
        >
          {t('premium.button_limit_15')}
        </button>

        <button
          onClick={() => handleUpgrade(30, 30)}
          className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
        >
          {t('premium.button_limit_30')}
        </button>

        <p className="mt-4 text-orange-800">Limiti - { submissionLimit }</p>
        <p className="text-orange-800">Tanga - { likeCount }</p>
      </div>
    </div>
  );
}

export default Premium;
