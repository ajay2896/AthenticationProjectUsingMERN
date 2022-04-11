

import express from 'express';
import { 
    UserRegistration, 
    UserLogin, 
    ChangeUserPassword,
    GetLoggedUserData,
    SendUserPasswordResetEmail,
    UserPasswordReset
} from '../controllers/UserController.js';
// Import User Authentication Middleware
import checkUserAuth from '../middlewares/auth-middleware.js';

// Creating Router
const UserRoutes = express.Router();

// Route Level Middleware - To Protected Route
UserRoutes.use( '/changepassword' , checkUserAuth );//Change After LoggIn Password
UserRoutes.use( '/loggeduser' , checkUserAuth );// When User LoggedIn


// Public Routes
UserRoutes.post('/register' , UserRegistration);// User Registeration
UserRoutes.post('/login' , UserLogin);// User Login
UserRoutes.post( '/send-reset-password-email' , SendUserPasswordResetEmail );// User Reset After LoggedIn Password
UserRoutes.post( '/reset-password/:id/:token' , UserPasswordReset );// User Foreget Password Before LoggedIn


// Protected Routes
UserRoutes.post('/changepassword' , ChangeUserPassword);// Change Password by User
UserRoutes.get( '/loggeduser' , GetLoggedUserData );// Get Data OF Logged User

export default UserRoutes;