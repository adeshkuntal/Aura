import React, { useEffect, useState } from "react";
import axios from "axios";
import ReelComment from "./ReelComment";

const backend = import.meta.env.VITE_BACKEND_API;

const ShowReel = ({ reelData, video, userId, onClose, setReels }) => {
  const [likes, setLikes] = useState(reelData.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchIsLiked = async () => {
      try {
        const res = await axios.get(`${backend}/isLikedReel`, {
          params: { reelId: reelData._id, Id: userId },
          withCredentials: true,
        });
        setIsLiked(res.data.isliked);
        setLikes(res.data.likes);
      } catch (err) {
        console.log("Error checking like status:", err);
      }
    };

    if (reelData._id && userId) fetchIsLiked();
  }, [reelData._id, userId]);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${backend}/likeReel`,
        { 
            reelId: reelData._id, 
            Id: userId 
          },
          {withCredentials: true}
      );

      if (res.data?.success) {
        setIsLiked(res.data.isLiked);
        setLikes(res.data.likes);
      }
    } catch (err) {
      console.error("Error liking post:", err);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this reel?")) return;

    try {
      await axios.delete(
        `${backend}/deleteReel/${reelData._id}`,
        { withCredentials: true }
      );
      setReels((prev) => prev.filter((r) => r._id !== reelData._id));
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden flex relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold"
        >
          ✖
        </button>

        {/* VIDEO */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          <video
            src={video}
            controls
            autoPlay
            loop
            className="h-full w-full object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="w-1/2 p-6 flex flex-col">

          {/* Caption */}
          <div className="flex justify-between items-start border-b pb-3">
            <div>
              <h2 className="font-bold text-lg mt-5">{reelData.caption}</h2>
              <p className="text-gray-600 text-sm mt-3 mb-5">
                {reelData.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <div className={`p-2 rounded-full ${isLiked ? "bg-pink-50" : "bg-gray-50"}`}>
                {isLiked ? "❤️" : "🤍"}
              </div>
              <span className="font-semibold">{likes} likes</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 items-center">
            <button
              onClick={handleLike}
              disabled={!userId}
              className={`justify-center gap-2 px-6 pr-7 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isLiked
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${!userId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                showComments
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💬 {showComments ? "Hide Comments" : "Show Comments"}
            </button>

            <button
                onClick={handleDelete}
                className="justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-red-500"
              >
                DELETE
              </button>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="border-t border-gray-200 pt-4 mt-4 animate-slideUp">
              <ReelComment reelId={reelData._id} userId={userId} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ShowReel;
