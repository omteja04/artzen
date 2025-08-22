import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database is Connected");
    })
    await mongoose.connect(`${DB_URI}/artzen`);
}
export default connectDB;