import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
    },
    referralCount: {
        type: Number
    },
    walletAddress: {
        type: String
    },
    referredBy: {
        type: String
    }
})


export const User = new mongoose.model("User", userSchema)