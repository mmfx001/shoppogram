import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CommentModal = ({ isOpen, onClose, onCommentSubmit, comments, productId, userEmail }) => {
    const [newComment, setNewComment] = useState('');

    if (!isOpen) return null;
    const handleCommentSubmit = async () => {
      if (newComment.trim()) {
          const payload = {
              id: uuidv4(), // Generate a unique ID for each comment
              productId,
              comment: newComment,
              userEmail,
              timestamp: new Date().toISOString(),
          };
  
          console.log("Sending payload:", payload);
  
          try {
              const response = await axios.post('https://shoop-9wre.onrender.com/comments', payload);
              console.log("Response data:", response.data);
              onCommentSubmit(response.data);
              setNewComment('');
          } catch (error) {
              console.error('Error submitting comment:', error);
          }
      }
  };
  
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Izohlar</h2>
                <div className="flex-1 overflow-y-auto mb-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-500">Hozircha hech qanday izoh yo'q.</p>
                    ) : (
                        [...comments].reverse().map((comment, index) => (
                            <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md">
                                <p className="font-semibold">{comment.userEmail}</p>
                                <p className="mt-1">{comment.comment}</p>
                                <p className="text-gray-500 text-sm mt-1">{new Date(comment.timestamp).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Izoh qo'shing..."
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
                    rows="6"
                />
                <button
                    onClick={handleCommentSubmit}
                    className="w-full p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Izohni yuborish
                </button>
            </div>
        </div>,
        document.body
    );
};

export default CommentModal;
