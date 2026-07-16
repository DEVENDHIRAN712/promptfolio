# Promptfolio - AI-Powered Career Operating System

Promptfolio is a state-of-the-art AI-powered Career Operating System built with the MERN stack.

## Tech Stack

### Frontend (`client/`)
- React 19 with Vite 6
- TypeScript
- Tailwind CSS v4 + Shadcn UI
- Framer Motion
- React Router
- TanStack Query
- React Hook Form
- Zustand
- Axios

### Backend (`server/`)
- Node.js + Express.js (TypeScript)
- MongoDB Atlas + Mongoose
- JWT + bcrypt
- Multer + pdf-parse
- Gemini API (@google/genai)

---

## Getting Started

### Install Dependencies

```bash
npm run install:all
```

or

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Environment Setup

Copy:

```bash
server/.env.example
```

to

```bash
server/.env
```

### Run Development Server

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Build

```bash
npm run build
```