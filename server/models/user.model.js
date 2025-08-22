import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    creditBalance: {
        type: Number,
        default: 5
    },


    // Password reset (secure crypto flow)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Refresh token storage (hashed) + expiry + rotation aid
    refreshTokenHash: { type: String, select: false },
    refreshTokenExpires: { type: Date, select: false },
    refreshTokenVersion: { type: Number, default: 0, select: false },

}, { timestamps: true });
const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;