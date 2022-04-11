

import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';// Convert Password of user into Hash
import jwt from 'jsonwebtoken';// this package used for user Authentication
import transporter from '../config/emailConfig.js';

// User Registration API
export const UserRegistration = async (req,res) => {

    // Data Come from User Enter
    const { name, email , password, password_confirmation, tc } = req.body;
    
    const user = await UserModel.findOne({ email: email });
    // console.log(`Exists : ${user}`);

    // check user Register or not
    if(user){

        // Sending Message
        res.send({ 
            "status":"failed" , 
            "message":"Email already exists"
        });

    }else{

        // If new user then all fields are Required 
        if(name && email && password && password_confirmation && tc){

            // If Password was Correct Then user Login and save data
            if(password === password_confirmation){

                try {
                    
                    // Convert User Password To Hash Password
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password,salt);
                
                    // Save Data after password match
                    const doc = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    });

                    // Data Save to DataBase
                    await doc.save();
                    // Find User
                    const saved_user = await UserModel.findOne({
                        email: email
                    })

                    //Genrate JWT Token For User Registration
                    const JWT_Token = jwt.sign(
                        { userID: saved_user._id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '5d' }
                    )

                    // Send Message After User Registration
                    res.status(201).send({
                        "status":"success",
                        "message":"Registration Success",
                        "token": JWT_Token
                    })

                } catch (error) {
                    res.status(500).send({ 
                        "status":"failed" , 
                        "message":"Unable to register",
                        "error": `${error}`
                    });
                }

            }else{
                res.status(500).send({ 
                    "status":"failed" , 
                    "message":"Password and Confirm password dosn't match"
                });
            }

        }else{
            res.status(500).send({ 
                "status":"failed" , 
                "message":"All fields are required"
            });
        }
    }
}


// User Login API
export const UserLogin = async (req,res) => {
 
    try {
        
        //Come User Details email & password
        const { email , password } = req.body;

        // Check email & password Filled or not
        if( email && password ){

            // Find User to database exist or not
            const user = await UserModel.findOne({ email: email });

            // When User Exist
            if( user != null ){

                // Matching Password From Enter User and DataBase Password
                const isMatch = await bcrypt.compare( password, user.password);

                // If Both Client and DataBase Password Matched Then Client Login
                if( (user.email === email) && isMatch ){

                    //Genrate JWT Token For User Registration
                    const JWT_Token = jwt.sign(
                        { userID: user._id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '5d' }
                    )

                    // Send Message when Client Login
                    res.send({
                        "status": "success",
                        "message": "Login Success",
                        "token": JWT_Token
                    });

                }else{
                    res.send({
                        "status": "failed",
                        "message": "Email or Password is Invalid"
                    });
                }

            }else{
                res.send({
                    "status": "failed",
                    "message": "You are not Registered User"
                });
            }

        }else{
            res.send({
                "status": "failed",
                "message": "All Fields are Required"
            });
        }

    } catch (error) {
        res.status(500).send({
            "status": "failed",
            "message": "Unable to Login"
        })
    }

}

// Change Password After Login  API
export const ChangeUserPassword = async ( req , res ) => {

    // Get Data From req.body
    const { password, password_confirmation } = req.body;

    
    if( password && password_confirmation ){

        // If Password & Confurmation_PasswordDo Not Match Then Change send message
        if( password !== password_confirmation ){
            res.send({
                "status": "failed",
                "message": "New Password and Confirm New Password doesn't match"
            })
        }else{
            // Then Change Password with Hashing
            // Creating salt
            const salt = await bcrypt.genSalt(10);
            //Hashing New Password
            const New_hashPassword = await bcrypt.hash( password , salt );
            
            // After User Authentication Find user and Update new password
            await UserModel.findByIdAndUpdate (
                req.user._id , 
                {$set: {password: New_hashPassword }}
            )

            // Send Message After Successfully change password
            res.send({
                "status": "success",
                "message": "Password Changed Successfullty"
            })
        }

    }else {
        res.send({
            "status": "failed",
            "message": "All Fields are Required"
        })
    }

}

// Get Data oF Logged User API
export const GetLoggedUserData = async ( req, res ) => {

    res.send({
        "user": req.user
    })

}


//  Forget Password Then Send Link to User Email to Reset Password 
export const SendUserPasswordResetEmail = async ( req, res ) => {

    // Get Email When Client Forget Password and Client enter Email to Foreget this Password  
    const { email } = req.body;

    // Check Email was enter or not by client
    if(email){

        // Search email Exists or Not in Database
        const user = await UserModel.findOne({ email: email });

        // When Email Exists in DataBase
        if(user){

            // Create secret Code using "user._id" & "JWT_SECRET_KRY"
            const secret = user._id + process.env.JWT_SECRET_KEY;

            // Genrate JWT Token For Valid "15minute" When user Forget password
            const token = jwt.sign(
                { userID: user._id },
                secret,
                { expiresIn: '15m' }
            )

            // Genrate Link For Forget Password and Link Valid For "15minute"
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;

            // Send Email // To Reset Password
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Password Reset Link ",
                html: `<a href=${link}> Click Here </a> to Reset Your Password`
            });

            // Send Message
            res.send({
                "status": "success",
                "message": "Password Reset Link Send in Email... Please Check Your Email",
                "info": info
            })

        }else{
            res.send({
                "status": "failed",
                "message": "Email dosn't exists"
            })
        }

    }else{
        res.send({
            "status": "failed",
            "message": "Email Field is Required"
        })
    }

}

// Reset Password When Client Click Link
export const UserPasswordReset = async ( req, res ) => {

    // Get New "password" & "confirmation_password" From Frontend Form Fileds
    const { password , password_confirmation } = req.body;

    // Get "id" & "token" from URL with Using "params"
    const { id , token } = req.params;

    // Serach User in DataBase From "id"
    const user = await UserModel.findById(id);

    // Genrate new secret Token From "user._id" and "JWT_SECRET_KEY"
    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    try {
        
        // Compare Secret old and new Both
        jwt.verify( token , new_secret );

        // Check "password" & "confirmation_password" are filled
        if( password && password_confirmation ){

            // Check "password" & and "password_confirmation" are same
            if( password !== password_confirmation ){
                res.send({
                    "status": "failed",
                    "message": "New Password and Confirm New Password Doesn't Match"
                })
            }else{
                
                // Hash the Password // When Password match Then 
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash( password , salt );

                // Update New Password // After Hash the Password
                await UserModel.findByIdAndUpdate( 
                    user._id,
                    { $set: { password: newHashPassword } }
                )

                // After Update New Password Then Send Message
                res.send({
                    "status": "success",
                    "message": "Password Reset Successfully"
                })
            }

        }else{

            res.send({
                "status": "failed",
                "message": "All Fields are Required"
            })

        }


    } catch (error) {
        
        res.send({
            "status": "failed",
            "message": "Invalid Token",
            "error": `${error}`
        })

    }

}