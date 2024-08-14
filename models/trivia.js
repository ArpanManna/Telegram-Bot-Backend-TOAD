import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answers: {
        type: Object,
    },
    active: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
    },
    score: {
        type: Number
    },
    correctAnswer: {
        type: String,
        required: true
    },
    responses: {
        type: Array
    }
})


export const Trivia = new mongoose.model("Trivia", triviaSchema)