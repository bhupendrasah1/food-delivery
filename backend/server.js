import './config/env.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js'; 
import { initializeTables } from './config/initDB.js';
import { initSocket } from './config/socket.js';
import authRoutes from './routes/authRoutes.js';
import shopRoutes from './routes/shopRoutes.js'; 
import itemRoutes from './routes/itemRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import foodRoutes from './routes/foodRoutes.js'; 
import passport from 'passport';
import './config/passport.js'; 




const startServer = async () => {
  await connectDB();
  await initializeTables();
};
startServer();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

initSocket(io);

// Middleware - ensure CORS and JSON body parsing are enabled before routes
// server.js मा:
app.use(cors({
  origin: [
    "https://food-delivery-frontend-xi-blond.vercel.app", 
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(passport.initialize());


// API Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/foods', foodRoutes);

app.get('/', (req, res) => {
    res.send('नमस्ते! Backend is running successfully! 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});