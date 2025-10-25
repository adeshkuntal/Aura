// Comment.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Comment = ({ postId, userId }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const commentsEndRef = useRef(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/getComment", {
        params: { postId },
        withCredentials: true,
      });
      if (res.data && res.data.comments) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    // Scroll to bottom when comments load or new comment is added
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      await axios.post(
        "http://localhost:5000/addComment",
        { postId, userId, text: comment },
        { withCredentials: true }
      );
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[400px]"> {/* Fixed height container */}
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Scrollable Comments List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 min-h-0"> {/* Flexible space for comments */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c._id}
                className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {c.userId.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {c.userId.username}
                  </span>
                </div>
                <p className="text-gray-700 text-sm pl-8">{c.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-500 text-sm">No comments yet</p>
                <p className="text-gray-400 text-xs">Be the first to share your thoughts!</p>
              </div>
            )}
            <div ref={commentsEndRef} /> {/* Invisible element to scroll to */}
          </div>
        )}
      </div>

      {/* Fixed Comment Input */}
      <div className="flex-shrink-0 bg-white pt-4 border-t border-gray-200"> {/* Fixed position input */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 pr-20"
              maxLength={500}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {comment.length}/500
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className={`self-end px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-md flex items-center gap-2 ${
              isSubmitting || !comment.trim()
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </form>
      </div>

      
    </div>
  );
};

export default Comment;