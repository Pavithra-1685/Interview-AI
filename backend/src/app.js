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
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const cleanOrigin = origin.trim().replace(/\/$/, "");
        const isAllowed = allowedOrigins.includes(cleanOrigin) || 
                          allowedOrigins.includes('*') ||
                          process.env.NODE_ENV !== 'production';

        if (isAllowed) {
            return callback(null, true);
        } else {
            console.error(`[CORS Blocked] Origin: "${origin}" is not in the allowed list:`, allowedOrigins);
            return callback(new Error(`Not allowed by CORS. Origin "${origin}" is not permitted.`));
        }
    },
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

module.exports = app;