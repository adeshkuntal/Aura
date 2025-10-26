import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (username.trim() === "") {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://aura-zwgl.onrender.com/getUsers", {
          params: { username },
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [username]);

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Find Users</h1>
        <p>Search for users by username</p>
      </div>

      <div className="search-input-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z" fill="currentColor"/>
          </svg>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="search-input"
          />
          {isLoading && (
            <div className="loading-spinner"></div>
          )}
        </div>
      </div>

      <div className="search-results">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="users-list">
            <h3 className="results-title">Found {users.length} user{users.length !== 1 ? 's' : ''}</h3>
            {users.map((user) => (
              <div
                key={user._id}
                className="user-card"
                onClick={() => navigate(`/home/search/${user._id}`)}
              >
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="username">{user.username}</span>
                </div>
                <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        ) : username && !isLoading ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 19C3 16.7909 4.79086 15 7 15H17C19.2091 15 21 16.7909 21 19V21H3V19Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No users found</h3>
            <p>Try searching with a different username</p>
          </div>
        ) : (
          <div className="initial-state">
            <svg className="search-illustration" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z" fill="currentColor"/>
            </svg>
            <h3>Start searching</h3>
            <p>Enter a username to find users</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .search-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .search-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .search-header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .search-input-container {
          margin-bottom: 30px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
          color: #999;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 16px 52px 16px 48px;
          font-size: 1rem;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          background: #fff;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .loading-spinner {
          position: absolute;
          right: 16px;
          width: 20px;
          height: 20px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .search-results {
          min-height: 200px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #666;
        }

        .loading-state .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e1e5e9;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .results-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 16px 0;
        }

        .users-list {
          animation: fadeIn 0.3s ease;
        }

        .user-card {
          display: flex;
          align-items: center;
          padding: 16px;
          margin-bottom: 8px;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-card:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          margin-right: 12px;
        }

        .user-info {
          flex: 1;
        }

        .username {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 1rem;
        }

        .chevron-icon {
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .empty-state, .initial-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #666;
        }

        .empty-icon, .search-illustration {
          width: 64px;
          height: 64px;
          color: #d1d5db;
          margin-bottom: 20px;
        }

        .empty-state h3, .initial-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p, .initial-state p {
          font-size: 1rem;
          color: #6b7280;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .search-container {
            padding: 20px 16px;
          }
          
          .search-header h1 {
            font-size: 2rem;
          }
          
          .search-input {
            padding: 14px 48px 14px 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;