import mongoose from "mongoose";

const partnerTasksResponseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    responses: {
        type: Array
    }
})


export const PartnerTasksResponse = new mongoose.model("PartnerTasksResponse", partnerTasksResponseSchema)