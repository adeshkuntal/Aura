import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import ShowUserpost from "../components/ShowUserpost";
import ShowUserReel from "../components/ShowUserReel";

const backend = import.meta.env.VITE_BACKEND_API;

const UserProfile = ({ user }) => {
  const { id } = useParams();

  const [userX, setUserX] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedReel, setSelectedReel] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer?.data) return "";
    const bytes = new Uint8Array(buffer.data);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backend}/getUser/${id}`, {
          withCredentials: true,
        });
        setUserX(res.data.user);
        if (res.data.user.followedBy?.includes(user?._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id, user?._id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/getPost/${id}`, {
          withCredentials: true,
        });
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReels = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/getReels`, {
          params: { userId: id },
          withCredentials: true,
        });
        setReels(res.data.reels || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    activeTab === "posts" ? fetchPosts() : fetchReels();
  }, [id, activeTab]);

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? "/unfollow" : "/follow";
      const res = await axios.post(
        `${backend}${endpoint}`,
        { user1: user?._id, user2: id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsFollowing(!isFollowing);
        setUserX((prev) => ({
          ...prev,
          followedBy: isFollowing
            ? prev.followedBy.filter((u) => u !== user?._id)
            : [...(prev.followedBy || []), user?._id],
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!userX) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 flex flex-col items-center">

      {/* PROFILE CARD */}
      <div className="w-full max-w-5xl bg-white/80 shadow-xl rounded-2xl p-8 mt-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src={
              userX.profilePic?.data
                ? `data:${userX.profilePic.contentType};base64,${arrayBufferToBase64(
                    userX.profilePic.data
                  )}`
                : "https://i.pinimg.com/736x/33/e0/c6/33e0c6104544936b133a09b8cb118385.jpg"
            }
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {userX.username}
                </h2>
                <p className="text-gray-500 text-sm mt-1 tracking-wide">
                  {userX.fullname || "Aura Member"}
                </p>
              </div>

              <button
                onClick={handleFollow}
                className={`self-start sm:self-center px-6 py-2 rounded-xl font-medium shadow-md transition
                ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>

            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-xl font-bold">{posts.length + reels.length}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div>
                <p className="text-xl font-bold">{userX.followedBy?.length || 0}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-xl font-bold">{userX.isFollowing?.length || 0}</p>
                <p className="text-gray-500">Following</p>
              </div>
            </div>

            <p className="mt-4 italic text-gray-700">
              {userX.bio || "✨ Welcome to my Aura space"}
            </p>
          </div>
        </div>
      </div>

      {/* POSTS / REELS TOGGLE */}
      <div className="mt-10 flex gap-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-10 py-3 rounded-xl font-semibold ${
            activeTab === "posts"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📸 Posts
        </button>

        <button
          onClick={() => setActiveTab("reels")}
          className={`px-10 py-3 rounded-xl font-semibold ${
            activeTab === "reels"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          🎥 Reels
        </button>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-6xl bg-white/90 rounded-3xl shadow-lg p-8 mt-8 mb-24">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : activeTab === "posts" ? (
          posts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {posts.map((post) => {
                const imageSrc = post.image?.data
                  ? `data:${post.image.contentType};base64,${arrayBufferToBase64(
                      post.image.data
                    )}`
                  : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

                return (
                  <div
                    key={post._id}
                    className="cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl"
                    onClick={() =>
                      setSelectedPost({ post, imageSrc, userId: user._id })
                    }
                  >
                    <img
                      src={imageSrc}
                      alt="post"
                      className="w-full h-full object-cover aspect-square"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts yet</p>
          )
        ) : reels.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() =>
                  setSelectedReel({
                    reel,
                    reelSrc: reel.videoUrl,
                    userId: user._id,
                  })
                }
              >
                <video
                  src={reel.videoUrl}
                  muted
                  className="w-full h-80 object-cover"
                />
                <div className="p-3">
                  <h1 className="text-gray-600 font-bold">{reel.caption}</h1>
                  <p className="text-sm text-gray-600">{reel.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No reels yet</p>
        )}
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-64 right-0">
        <Footer />
      </div>

      {selectedPost && (
        <ShowUserpost
          postData={selectedPost.post}
          image={selectedPost.imageSrc}
          userId={selectedPost.userId}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {selectedReel && (
        <ShowUserReel
          reelData={selectedReel.reel}
          video={selectedReel.reelSrc}
          userId={selectedReel.userId}
          onClose={() => setSelectedReel(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;
