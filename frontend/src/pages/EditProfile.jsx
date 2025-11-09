import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user, setUser }) => {
  const [form, setForm] = useState({
    bio: user?.bio || "",
    fullname: user?.fullname || ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", user?._id);
      formData.append("bio", form.bio);
      formData.append("fullname", form.fullname);
      
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await axios.put(
        "https://aura-zwgl.onrender.com/updateprofile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data.user);
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage("Update failed. Please try again.");
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer?.data) return "";
    const bytes = new Uint8Array(buffer.data);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mt-4 md:mt-8">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Update your personal information</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="relative mb-4">
          <img
            src={
              previewUrl || 
              (user?.profilePic?.data 
                ? `data:${user.profilePic.contentType};base64,${arrayBufferToBase64(user.profilePic.data)}`
                : "https://i.pinimg.com/736x/33/e0/c6/33e0c6104544936b133a09b8cb118385.jpg")
            }
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 md:p-2 rounded-full hover:bg-indigo-600 transition shadow-md text-sm"
          >
            📷
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-gray-600 text-xs md:text-sm">Click camera icon to change photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="3"
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none text-sm md:text-base"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex-1 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition font-medium text-sm md:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 md:w-5 md:h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
          message.includes("successful") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EditProfile;