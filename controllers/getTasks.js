import { SocialResponse } from "../models/socialResponse.js"
import { Tasks } from "../models/tasks.js"


const getTasks = async (req, res) => {
    const { userId } = req.query
    try {
        const tasks = await Tasks.find({})
        const response = await SocialResponse.find({userId: userId})
        // sort by date and send last 50 earnings
        if (response) {
            res.status(200).json({
                success: true,
                tasks: tasks,
                response: response
            })
        }
        else {
            return res.status(200).json({
                success: false,
                earnings: null
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getTasks