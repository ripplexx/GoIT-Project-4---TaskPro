# TaskPro Backend

Express + MongoDB (Mongoose) REST API for the TaskPro app.

## Requirements

- Node.js 18 or higher
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account (avatar uploads)
- A Brevo account (the "Need help" mail form)

## Local setup

```bash
cd backend
npm install
copy .env.example .env   # on macOS/Linux: cp .env.example .env
npm start
```

The server starts on `http://localhost:3001`.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default 3001) |
| `MONGODB_URI` | MongoDB connection string (Atlas `mongodb+srv://...`) |
| `CLIENT_URL` | Frontend origin allowed by CORS (e.g. `http://localhost:3000`) |
| `NODE_ENV` | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `BREVO_API_KEY` | Brevo API key |
| `MAIL_FROM` | Sender address for help emails |
| `HELP_RECIPIENT_EMAIL` | Address that receives help requests |

Never commit your real `.env` file.

## Deployment (Render)

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add all variables above in the Render Environment tab.