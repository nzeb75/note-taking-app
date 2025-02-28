require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const logMiddleware = require('./middleware/logMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const connectDB = require('./config/db');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(logMiddleware);

//Connect to MongoDB
connectDB();

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

//Errorhandler
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`));


