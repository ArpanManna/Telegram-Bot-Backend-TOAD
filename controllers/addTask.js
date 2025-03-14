import { Tasks } from "../models/tasks.js";

const addTask = async (req, res) => {
    const { title, meta, score } = req.body;
    try {
        const newTask = new Tasks({
            title: title,
            meta: meta ? meta : null,
            score: score,
        })
        await newTask.save()
        return res.status(200).json({
            success: true,
            msg: "added"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "failed"
        })
    }
}

export default addTask