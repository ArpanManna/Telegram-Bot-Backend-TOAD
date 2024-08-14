import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// establish DB connection
const connectDatabase = () => {
    mongoose.connect(process.env.DB_CONNECTION_URL)
    .then(
        () => console.log("Database connected!")
    )
    .catch(
        error => console.log('Database connection Failed!', error)
    )
}

export default connectDatabase