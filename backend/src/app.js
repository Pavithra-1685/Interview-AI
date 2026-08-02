const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://interview-ai-two-roan.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
    origin: isProduction ? allowedOrigins : true,
    credentials: true
}));

/*importing routes*/
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes')

/*using routes*/
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Interview AI Backend Server is running successfully!",
        environment: process.env.NODE_ENV || "development"
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: "File upload failed.",
            error: "The uploaded file is too large. Maximum allowed size is 10MB."
        });
    }
    
    if (err.name === 'MulterError') {
        return res.status(400).json({
            message: "File upload failed.",
            error: err.message
        });
    }
    
    res.status(err.status || 500).json({
        message: err.message || "Internal server error occurred.",
        error: err.stack
    });
});

module.exports = app;