import mongoose from "mongoose";

const partnerTasksSchema = new mongoose.Schema({
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


export const PartnerTasks = new mongoose.model("PartnerTasks", partnerTasksSchema)