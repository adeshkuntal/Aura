import React from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Profile = ({ user, setUser }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const arrayBufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return "";
    try {
      const bytes = new Uint8Array(buffer.data);
      let binary = '';
      bytes.forEach(byte => binary += String.fromCharCode(byte));
      return window.btoa(binary);
    } catch (error) {
      console.error("Error converting buffer to base64:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/getPosts", {
          params: { userId: user?._id },
          withCredentials: true
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?._id) {
      fetchPosts();
    }
  }, [user]);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <ProfileHeader user={user} setUser={setUser} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture - THIS WORKS */}
            <div className="relative">
              <img
                src={
                  user.profilePic?.data
                    ? `data:${user.profilePic.contentType};base64,${arrayBufferToBase64(user.profilePic.data)}`
                    : "https://i.pinimg.com/736x/33/e0/c6/33e0c6104544936b133a09b8cb118385.jpg"
                }
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = "https://i.pinimg.com/736x/33/e0/c6/33e0c6104544936b133a09b8cb118385.jpg";
                }}
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-gray-600 mt-1">{user.fullname || "Aura Member"}</p>
                </div>
                <Link
                  to="/edit-profile"
                  className="mt-4 md:mt-0 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-md"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-900">{posts?.length || 0}</span>
                  <span className="text-gray-600 text-sm">Posts</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-900">{user.followers || 0}</span>
                  <span className="text-gray-600 text-sm">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-900">{user.following || 0}</span>
                  <span className="text-gray-600 text-sm">Following</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mt-4 text-center md:text-left">
                {user.bio || "Welcome to my Aura profile! ✨"}
              </p>
            </div>
          </div>
        </div>


        {/* Posts Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Posts</h3>

          <Link
            to="/upload-post"
            className="inline-block bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition mb-6"
          >
            Upload Post
          </Link>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post, index) => {
                const imageSrc = post.image?.data
                  ? `data:${post.image.contentType};base64,${arrayBufferToBase64(post.image.data)}`
                  : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

                return (
                  <div key={post._id || index} className="relative group cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                          src={imageSrc}
                          alt={`Post ${index + 1}`}
                          className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gray-400">📷</span>
              </div>
              <p className="text-gray-500 text-lg">No posts yet</p>
              <p className="text-gray-400 mt-2">Share your first moment with Aura</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;