const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://behomes-1.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the incoming origin is in the list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Block the origin
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials if needed
};

// Use the CORS middleware with the options
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/auth', require('./routes/auth'));
app.use('/project', require('./routes/project'));
app.use('/basicDrawing', require('./routes/basicDrawing'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));