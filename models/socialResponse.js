import mongoose from "mongoose";

const socialResponseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    responses: {
        type: Array
    }
})


export const SocialResponse = new mongoose.model("SocialResponse", socialResponseSchema)