import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MySQL connection
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // add if you set a password
  database: 'project',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID', db.threadId);
});

// Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

