<div align="center">

# ⚡ TaskPro

**A Trello-style task management app built with React, Node.js and MongoDB.**
Organize your work into boards, columns and cards, set priorities and deadlines, and make the workspace your own.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://go-it-project-4-taskpro.vercel.app)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://taskpro-backend-o2d1.onrender.com)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)

</div>

---

## 🚀 Try it now

**Live app:** https://go-it-project-4-taskpro.vercel.app

Want to look around without signing up? Use the demo account:

| | |
|---|---|
| **Email** | `demo@taskpro.com` |
| **Password** | `Demo1234` |

> ⏳ The backend runs on Render's free plan and goes to sleep after a period of inactivity. The **first request can take 30–50 seconds**, after that everything is fast.
>
> The demo account is shared and public, so please don't store anything personal in it.

<!--
  Add screenshots here once you have them, for example:
  ![Boards](docs/boards.png)
  ![Dark theme](docs/dark-theme.png)
-->

## ✨ Features

- 🔐 **Authentication:** registration with automatic sign-in, login and logout. The session is restored on page load through a refresh-token cookie, and expired access tokens are renewed automatically
- ✅ **Validated forms:** React Hook Form + Yup on every form (email, password 8–64 chars without spaces, name 2–32 chars), plus server-side validation with Joi
- 📋 **Boards:** create, edit and delete boards, each with its own icon and background
- 🗂️ **Columns and cards:** add, edit and delete columns and cards
- 🎯 **Priorities and deadlines:** color-coded priority levels, deadline picker that blocks past dates
- 🔀 **Move cards** between columns from the card menu
- 🔎 **Filter** cards by priority
- 🎨 **Three themes:** Light, Violet and Dark
- 👤 **Profile editing:** change name, email, password and avatar (avatars stored on Cloudinary)
- 💬 **Need help form:** sends a support request by email through Brevo
- 📱 **Responsive** design for mobile, tablet and desktop

## 🧰 Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router 6, React Hook Form, Yup, date-fns, Context API |
| **Backend** | Node.js, Express, Mongoose, JWT, bcrypt, Joi |
| **Database** | MongoDB Atlas |
| **Services** | Cloudinary (avatar uploads), Brevo (transactional email) |
| **Hosting** | Vercel (frontend), Render (backend) |

## 🔐 How authentication works

1. On login or registration the API returns a short-lived **access token**, which the frontend keeps in memory only, never in `localStorage`
2. The **refresh token** lives in a cookie, so requests are sent with `credentials: 'include'`
3. When a request returns `401`, the API client silently asks `/auth/refresh` for a new access token and retries the request once
4. On every page load the app calls the refresh endpoint to check whether the session is still valid, so users stay signed in across reloads

## 🧪 Frontend scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server on port 3000 |
| `npm run build` | Creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## 🗺️ Routes

| Path | Page |
|---|---|
| `/welcome` | Landing page with Registration and Log In buttons |
| `/auth/register` | Registration form |
| `/auth/login` | Login form |
| `/home` | Private home page with header and sidebar |
| `/home/:boardId` | A single board with its columns and cards |

## 📁 Project structure

```
.
├── backend/
│   ├── scripts/        # seed.js: creates the demo user and board
│   └── src/
│       ├── controllers/
│       ├── db/         # connection and Mongoose models
│       ├── middlewares/
│       ├── routers/
│       ├── services/
│       ├── validation/ # Joi schemas
│       └── server.js
├── public/
├── src/
│   ├── api/            # fetch client (auto token refresh) and auth, board, help calls
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/        # Auth, Board and Theme contexts
│   ├── pages/          # Welcome, Auth, Home, Screens, NotFound
│   └── utils/          # helpers and Yup validation schemas
├── .env.template
├── vercel.json
└── vite.config.js
```

## 🏁 Getting started

### Prerequisites

- Node.js 18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database (the free tier is enough)
- A [Cloudinary](https://cloudinary.com) account (free)
- A [Brevo](https://www.brevo.com) account with a verified sender (free)

### 1. Clone the repository

```bash
git clone https://github.com/ripplexx/GoIT-Project-4---TaskPro.git
cd GoIT-Project-4---TaskPro
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Open `backend/.env` and fill in your values (see the table below), then:

```bash
npm start
```

The API runs on `http://localhost:3001`.

### 3. Start the frontend

In a second terminal, from the project root:

```bash
npm install
cp .env.template .env     # Windows: copy .env.template .env
npm run dev
```

The app runs on `http://localhost:3000`.

### 4. (Optional) Load demo data

```bash
cd backend
node scripts/seed.js
```

This creates the `demo@taskpro.com` account and a sample **Project Office** board with three columns and four cards. It's safe to run more than once, existing data is never deleted.

## 🔑 Environment variables

**Frontend** (`.env` in the project root)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:3001/api`. If it is not set, the app falls back to a relative `/api`, which does not exist on a static host like Vercel |

**Backend** (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `3001`) |
| `MONGODB_URI` | MongoDB connection string (Atlas `mongodb+srv://...`) |
| `CLIENT_URL` | Frontend origin allowed by CORS, e.g. `http://localhost:3000` |
| `NODE_ENV` | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `BREVO_API_KEY` | Brevo API key (from **SMTP & API → API keys**) |
| `MAIL_FROM` | Sender address, must be verified in Brevo |
| `HELP_RECIPIENT_EMAIL` | Address that receives "Need help" messages |

> 🔒 Never commit your real `.env` files. They are already listed in `.gitignore`.

## ☁️ Deployment

**Backend on Render**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add every backend variable from the table above in the **Environment** tab. Set `CLIENT_URL` to your Vercel URL (no trailing slash).

**Frontend on Vercel**

1. Add `VITE_API_URL` with the value `https://<your-backend>.onrender.com/api`
2. Redeploy, since Vercel doesn't rebuild automatically when variables change

## 👩‍💻 Author

**Ripplex**
GitHub: [@ripplexx](https://github.com/ripplexx)

Built as the final project of the GoIT Fullstack course.
