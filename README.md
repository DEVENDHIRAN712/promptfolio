# Promptfolio - AI-Powered Career Operating System

Promptfolio is a state-of-the-art AI-powered Career Operating System built with the MERN stack.

## Tech Stack

### Frontend (`client/`)
- **React 19** with **Vite 6**
- **TypeScript**
- **Tailwind CSS v4** + **Shadcn UI**
- **Framer Motion** for dynamic animations
- **React Router** for routing
- **TanStack Query** for data fetching & caching
- **React Hook Form** for form handling
- **Zustand** for state management
- **Axios** for API calls

### Backend (`server/`)
- **Node.js** + **Express.js** (written in **TypeScript**)
- **MongoDB Atlas** + **Mongoose**
- **JWT** + **bcrypt** for authentication
- **Multer** + **pdf-parse** for resume processing
- **Gemini API** (`@google/genai`) for AI intelligence

---

## Getting Started

### 1. Install Dependencies
Run the following command from the root directory to install all dependencies for the root workspace, client, and server:
```bash
npm run install:all
```
or simply:
```bash
npm install && cd server && npm install && cd ../client && npm install && cd ..
```

### 2. Environment Configuration
Copy `server/.env.example` to `server/.env` and update values if needed:
```bash
cp server/.env.example server/.env
```

### 3. Development Server
Start both frontend and backend concurrently:
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000` (`http://localhost:5000/api/health`)

### 4. Production Build
Build both client and server applications:
```bash
npm run build
```
