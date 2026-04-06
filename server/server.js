import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { generateSitemap } from './utils/sitemapGenerator.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cabRoutes from './routes/cabRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'
import dns from 'dns';


dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

app.use(cors({ 
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Routes for SEO
app.get('/sitemap.xml', generateSitemap);
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${process.env.FRONTEND_URL}/sitemap.xml`);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/content/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);
// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`));