
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectdb.js';
import UserRoutes from './routes/UserRoutes.js';//Import Routes
import bodyParser from 'body-parser';

// ENV File
dotenv.config();

const app = express();
const port = process.env.PORT;

// DataBase URL
const DATABASE_URL = process.env.DATABASE_URL;

// Body-Parser Middleware
app.use(bodyParser.urlencoded( {extended: true } ));
app.use(express.json());

// CORS Policy // While Connecting Frontend and Backend
app.use(cors());

// Database Connection 
connectDB(DATABASE_URL);

// JSON Mddleware
app.use(express.json());

// Routes
app.use( '/api/user' , UserRoutes );


// Sever Running 
app.listen( port , () => {
    console.log(`Server running at http://localhost:${port}`);
} )


