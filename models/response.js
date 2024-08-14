import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    users: {
        type: Array
    }
})


export const Response = new mongoose.model("Response", triviaSchema)