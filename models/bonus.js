import mongoose from "mongoose";

const bonusSchema = new mongoose.Schema({
    initialUsersCount: {
        type: Number,
        default: 0
    }
})

export const Bonus = new mongoose.model("Bonus", bonusSchema)