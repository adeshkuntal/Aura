import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

const ShowPost = ({ postData, image, userId, onClose }) => {
  const [likes, setLikes] = useState(postData.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchIsLiked = async () => {
      try {
        const res = await axios.get("http://localhost:5000/isLiked", {
          params: { postId: postData._id, Id: userId },
          withCredentials: true,
        });
        setIsLiked(res.data.isliked);
      } catch (err) {
        console.log(err);
      }
    };

    if (postData._id && userId) fetchIsLiked();
  }, [postData._id, userId]);


  const handleLike = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/like",
        null,
        { params: { postId: postData._id, Id: userId }, withCredentials: true }
      );

      if (res.data?.success) {
        setLikes(res.data.likes);
        setIsLiked(res.data.isLiked);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleImageLoad = () => setIsImageLoading(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/60 animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
      >
        <span className="text-2xl text-gray-700 group-hover:text-red-500 font-bold">
          ✕
        </span>
      </button>

      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-scaleIn">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          <div className="md:w-1/2 relative bg-gray-100 flex items-center justify-center">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            )}
            <img
              src={image}
              alt="Post"
              onLoad={handleImageLoad}
              className={`w-full h-64 md:h-auto object-cover transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="md:w-1/2 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  {postData.caption || "✨ Beautiful Moment"}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {postData.description ||
                    "This is a beautiful moment captured by the user on Aura."}
                </p>
              </div>

              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className={`p-2 rounded-full ${isLiked ? "bg-pink-50" : "bg-gray-50"}`}>
                    {isLiked ? "❤️" : "🤍"}
                  </div>
                  <span className="font-semibold">{likes} likes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isLiked
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    showComments
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💬 {showComments ? "Hide Comments" : "Show Comments"}
                </button>
              </div>

              {showComments && (
                <div className="border-t border-gray-200 pt-4 animate-slideUp">
                  <Comment postId={postData._id} userId={userId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPost;
