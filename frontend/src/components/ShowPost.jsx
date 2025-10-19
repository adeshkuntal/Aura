import React, { useState } from "react";
import axios from "axios";

const ShowPost = ({ postData, image, onClose }) => {
  const [likes, setLikes] = useState(postData.likes || 0);

  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/like/${postData._id}`);
      if (res.data.success) {
        setLikes(res.data.likes);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <img
          src={image}
          alt="Post"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {postData.caption || "No caption"}
        </h2>

        <div className="flex justify-between">
          <button
            onClick={handleLike}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            👍 Like ({likes})
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
            💬 Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowPost;
