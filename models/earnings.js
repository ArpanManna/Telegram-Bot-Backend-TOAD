import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    earnings: {
        type: Array
    }
})


export const Earnings = new mongoose.model("Earnings", earningsSchema)