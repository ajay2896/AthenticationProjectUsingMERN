

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Using .env File
dotenv.config();

// Transporter
let transporter = nodemailer.createTransport({
    
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, //Admin Gmail Password
        pass: process.env.EMAIL_PASS // Admin Gmail Password
    }

})

export default  transporter;
