
import mongoose from "mongoose";

// Defining Schema
const UserSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    tc: {type:Boolean , required:true}
})

// Creating Model
const UserModel = mongoose.model( "user" , UserSchema );// 'user' is Collection name OF 'AjayApi' DataBase

export default UserModel;