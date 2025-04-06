import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error(err);
});

// Define Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Basic Routes
app.get('/', (req, res) => {
  res.send('Welcome to EDU-HUB LMS');
});

app.get('/about', (req, res) => {
  res.send('About EDU-HUB LMS');
});

app.get('/contact', (req, res) => {
  res.send('Contact us at support@eduhub.com');
});

// Register Route
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  // Add logic to register the user
  res.send('User registered successfully');
});

// Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Add logic to authenticate the user
  res.send('User logged in successfully');
});

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});