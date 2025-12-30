import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const backend = import.meta.env.VITE_BACKEND_API;

const UploadReel = ({ user }) => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setVideo(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      alert("Please select a video!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user?._id);
      formData.append("video", video);
      formData.append("caption", caption);
      formData.append("description", description);

      const res = await axios.post(
        `${backend}/upload-reel`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/home");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setVideo(droppedFile);
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const removeFile = () => {
    setVideo(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload New Reel
          </h1>
          <p className="text-gray-600">
            Share short videos with your Aura
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Video Upload */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              Reel Video
            </label>

            {!video ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">
                    Click or drag to upload reel
                  </p>
                  <p className="text-gray-500 text-sm">
                    MP4 / MOV • Max 30 seconds
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <video
                    src={previewUrl}
                    className="w-full h-64 object-cover"
                    controls
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-green-600 text-sm font-medium mt-2 text-center">
                  Video selected successfully
                </p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
          </div>

          {/* Fields */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Catchy caption for your reel"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:bg-white transition"
                maxLength={100}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Short & engaging</span>
                <span>{caption.length}/100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your reel..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:bg-white resize-none transition"
                maxLength={300}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Add more context</span>
                <span>{description.length}/300</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/home")}
                disabled={isUploading}
                className="flex-1 py-3 border rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!video || isUploading}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
              >
                {isUploading ? "Uploading..." : "Share Reel"}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Reel Tips
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Keep reels under 30 seconds</li>
            <li>• Vertical videos work best</li>
            <li>• Add engaging captions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadReel;
