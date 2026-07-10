# Aurelia Marmi - Luxury Natural Stone & Marble Platform

Welcome to **Aurelia Marmi**, an immersive, high-end digital showroom and commerce platform for premium marble, onyx, granite, and natural stones. This repository is organized as a monorepo consisting of:

- `/frontend`: Next.js 14+ (App Router, Tailwind CSS, TypeScript, Three.js, React Three Fiber, Framer Motion)
- `/backend`: FastAPI (Python) web API with SQLAlchemy, SQLite database, and JWT Auth.

---

## Technical Features

1. **Luxury Visual Presentation**: Cinematic parallaxes, cursor light glows, glassmorphism UI, premium fonts (Playfair Display, Poppins, Inter).
2. **Interactive 3D Slab Viewer**: A custom React Three Fiber component allowing customers to spin, zoom, pan, adjust lighting intensity, and review reflective qualities of individual slabs.
3. **3D Virtual Showroom**: A full 3D environment rendered using Three.js / R3F allowing clients to walk around the showroom and click stone columns.
4. **AI Room Visualizer**: An interactive canvas interface simulating stone replacement in kitchen/bathroom rooms with a split slider.
5. **AI Image-to-3D Model Generator**: Integrated client workspace where admins can trigger stone image transformations to optimized 3D GLB assets.
6. **AI Design Companion**: Floating assistant capable of answering questions, recommending stones, calculating pricing/quantities, and suggesting care guidelines.
7. **Admin Dashboard**: Analytics, products management, quotes tracker, and media control deck.

---

## Installation & Running Locally

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python main.py
   ```
   The backend will start at `http://127.0.0.1:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.
