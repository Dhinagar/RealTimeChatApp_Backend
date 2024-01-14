// server.js
const express = require('express');
const mongoose = require('mongoose');
//const cacheMiddleware = require('express-cache-middleware');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
const port = 3000;

// Load environment variables
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.MONGODB_URI}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("DB connected.")
}).catch((err)=>{
    console.log("DB connection failed.",err)
});

app.use(express.json());

// Express middleware for caching
// const cache = cacheMiddleware({
//   store: 'memory',
//   expire: 60,
// });

// Register routes\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
