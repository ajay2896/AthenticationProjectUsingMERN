


import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';// Import Model

// Check Authentication From JWT Token
var checkUserAuth = async ( req , res , next ) => {

    let token;

    // Get Token From Header From Frontend
    const { authorization } = req.headers;

    // If token start with Bearer
    if( authorization &&  authorization.startsWith('Bearer')) {

        try {
            // Get Token From Header
            token = authorization.split(' ')[1];
            // console.log('Token ',token);
            // console.log('Authorization: ',authorization);

            // Varify Token with  JWT SSECRET Key 
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Get User From Token
            req.user = await UserModel.findById(userID).select('-password');

            // After Autorized then next Routes Run
            next();

        } catch (error) {
            res.send({
                "status": "failed",
                "message": "Unauthoriized User",
                "error": `${error}`
            })
        }
    }

    // If Token Not come From User
    if(!token){
        res.status(401).send({
            "status": "failed",
            "message": "Unauthorized User, No Token"
        })
    }
}

export default checkUserAuth;