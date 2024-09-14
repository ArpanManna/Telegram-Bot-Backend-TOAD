import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    meta: {
        type: Object,
    },
    score: {
        type: Number
    },
    responses: {
        type: Array
    }
})


export const Tasks = new mongoose.model("Tasks", tasksSchema)