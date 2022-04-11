
import mongoose from "mongoose";

// Connecting DataBase
const connectDB = async (DATABASE_URL) => {
    try {

        const DB_OPTION = {
            // DataBase Name
            dbName:"AjayApi"
        }
        
        await mongoose.connect(DATABASE_URL , DB_OPTION );
        console.log('DataBase Connected Successfully...');

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;