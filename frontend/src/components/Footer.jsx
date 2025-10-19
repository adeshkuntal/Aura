import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Terms</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Help</a>
          </div>
          
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Aura. All rights reserved.
          </p>
          <p>Made with ❤️ by Adesh</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;