<div align="center">

<img src="https://img.shields.io/badge/Aura-Social%20Media%20App-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="Aura Banner"/>

# ✨ Aura

### A modern full-stack social media platform — share posts, reels, follow users, and more.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-aura0.netlify.app-6366f1?style=flat-square)](https://aura0.netlify.app)
[![Backend](https://img.shields.io/badge/API-Vercel-black?style=flat-square&logo=vercel)](https://aura0-jade.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](#license)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**Aura** is a full-stack Instagram-inspired social media application built with the MERN stack. It lets users register, build a profile, upload photo posts and short video reels, follow other users, like and comment on content, and explore the community through search. The frontend is deployed on Netlify and the backend API on Vercel, with media stored securely on Cloudinary.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [https://aura0.netlify.app](https://aura0.netlify.app) |
| ⚙️ Backend API | [https://aura0-jade.vercel.app](https://aura0-jade.vercel.app) |

---

## ✅ Features

- 🔐 **Authentication** — Register & login with JWT-based sessions via secure HTTP-only cookies
- 👤 **User Profiles** — Customisable profile with avatar, full name, and bio
- 🖼️ **Posts** — Upload images with captions and descriptions; like and comment
- 🎬 **Reels** — Upload short videos (up to 100 MB) with captions; like and comment
- 🔍 **Search** — Discover and explore other users
- 👥 **Follow System** — Follow/unfollow users; view follower and following counts
- ✏️ **Edit Profile** — Update name, bio, and profile picture at any time
- ☁️ **Cloud Storage** — All media (images & videos) stored on Cloudinary
- 📱 **Responsive UI** — Mobile-friendly design built with Tailwind CSS
- ⚡ **Smooth Animations** — GSAP-powered page transitions and interactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| GSAP | Animations |
| Lucide React | Icon library |
| React Player | Video playback |
| Socket.IO Client | Real-time support (configured) |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary | Image & video hosting |
| Multer | File upload handling |
| Cookie Parser | JWT cookie management |
| Socket.IO | Real-time (configured) |
| dotenv | Environment config |

---

## 📁 Project Structure

```
Aura-main/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK setup
│   │   ├── db.js               # MongoDB connection
│   │   └── multerReel.js       # Multer config for reels
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Post.js             # Post schema
│   │   └── Reel.js             # Reel schema
│   ├── routes/
│   │   └── auth.js             # All API routes
│   ├── server.js               # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Comment.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProfileHeader.jsx
    │   │   ├── ReelComment.jsx
    │   │   ├── ShowPost.jsx
    │   │   ├── ShowReel.jsx
    │   │   ├── ShowUserReel.jsx
    │   │   └── ShowUserpost.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── EditProfile.jsx
    │   │   ├── UploadPost.jsx
    │   │   ├── UploadReel.jsx
    │   │   ├── Search.jsx
    │   │   ├── UserProfile.jsx
    │   │   └── Layout.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account (free tier works)

---

### Environment Variables

#### Backend — create `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend — create `frontend/.env`

```env
VITE_BACKEND_API=http://localhost:5000
```

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/Aura.git
cd Aura
```

2. **Install backend dependencies & start the server**

```bash
cd backend
npm install
npm run dev
```

> Backend runs at `http://localhost:5000`

3. **Install frontend dependencies & start the dev server**

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5173`

4. **Open your browser** and go to `http://localhost:5173` 🎉

---

## 📡 API Overview

All routes are served from the backend Express server.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT cookie |
| `GET` | `/me` | Get authenticated user info |
| `GET` | `/logout` | Clear session cookie |
| `PUT` | `/edit-profile` | Update profile info & avatar |
| `POST` | `/upload-post` | Upload a new photo post |
| `GET` | `/posts/:userId` | Get posts for a user |
| `POST` | `/like/:postId` | Like / unlike a post |
| `POST` | `/comment/:postId` | Add a comment to a post |
| `POST` | `/upload-reel` | Upload a video reel |
| `GET` | `/reels/:userId` | Get reels for a user |
| `POST` | `/like-reel/:reelId` | Like / unlike a reel |
| `POST` | `/comment-reel/:reelId` | Comment on a reel |
| `GET` | `/search` | Search users by username |
| `POST` | `/follow/:id` | Follow a user |
| `POST` | `/unfollow/:id` | Unfollow a user |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and include clear commit messages.

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ · [Live Demo →](https://aura0.netlify.app)

</div>