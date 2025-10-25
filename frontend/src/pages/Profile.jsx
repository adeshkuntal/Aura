import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import ShowPost from "../components/ShowPost";
import axios from "axios";

const Profile = ({ user, setUser }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return "";
    try {
      const bytes = new Uint8Array(buffer.data);
      let binary = "";
      bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
      return window.btoa(binary);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/getPosts", {
          params: { userId: user?._id },
          withCredentials: true,
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 flex flex-col items-center">
      {/* Profile Card */}
      <div className="w-full max-w-5xl backdrop-blur-md bg-white/80 border border-white/30 shadow-xl rounded-2xl p-8 mt-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <img
              src={
                user.profilePic?.data
                  ? `data:${user.profilePic.contentType};base64,${arrayBufferToBase64(
                      user.profilePic.data
                    )}`
                  : "https://i.pinimg.com/736x/33/e0/c6/33e0c6104544936b133a09b8cb118385.jpg"
              }
              alt="Profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-lg object-cover transition-transform hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {user.fullname || "Aura Member"}
                </p>
              </div>
              <Link
                to="/home/edit-profile"
                className="mt-4 md:mt-0 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                ✏️ Edit Profile
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-10 mb-3">
              {[
                { label: "Posts", value: posts?.length || 0 },
                { label: "Followers", value: user.followers || 0 },
                { label: "Following", value: user.following || 0 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block text-xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-gray-500 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p className="text-gray-700 mt-2 italic text-center md:text-left max-w-xl mx-auto md:mx-0">
              {user.bio || "✨ Welcome to my Aura space — let’s make memories!"}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 mt-10 mb-20 border border-white/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">📸 Your Posts</h3>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Fetching posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {posts.map((post, i) => {
              const imageSrc = post.image?.data
                ? `data:${post.image.contentType};base64,${arrayBufferToBase64(
                    post.image.data
                  )}`
                : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
              return (
                <div
                  key={post._id || i}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setSelectedPost({ post, imageSrc, userId: user?._id })}
                >
                  <img
                    src={imageSrc}
                    alt={`Post ${i + 1}`}
                    className="w-full h-full object-cover aspect-square group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg font-semibold transition-all">
                    View Post
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">📷</span>
            </div>
            <p className="text-gray-600 text-lg font-medium">No posts yet</p>
            <p className="text-gray-400 mt-2">Share your first Aura moment ✨</p>
          </div>
        )}
      </div>
      {/* Fixed Footer beside Sidebar */}
        <div className="fixed bottom-0 right-0 left-64 z-40">
          <Footer />
        </div>

      {/* ShowPost Modal */}
      {selectedPost && (
        <ShowPost
          postData={selectedPost.post}
          image={selectedPost.imageSrc}
          userId={selectedPost.userId}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default Profile;
