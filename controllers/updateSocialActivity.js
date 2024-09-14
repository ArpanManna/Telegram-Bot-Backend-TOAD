import { Tasks } from "../models/tasks.js";
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";
import { SocialResponse } from "../models/socialResponse.js";

// 1. update Task response
// 2. If correct response, add score to user balance 
// 3. If correct response, add score to earnings
const updateSocialResponse = async (req, res) => {
    const { socialTaskId, userId, userName } = req.body;
    console.log(req.body)
    // check if user doesnot exist create user document in db
    try {
        const user = await User.find({ chatId: userId })
        if (!user.length) {
            // create user document
            let newUser = new User({
                chatId: userId,
                userName: userName,
                active: true,
                balance: 0,
                referralCount: 0
            })
            await newUser.save()
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        })
    }
    try {
        const task = await Tasks.find({ _id: socialTaskId })
        console.log(task)
        if (!task) {
            return res.status(400).json({
                success: false,
                error: 'Updation failed. Task not found.'
            })
        }

        const response = await SocialResponse.find({ userId: userId })
        console.log("response:", response)
        if (!response.length) {
            let newResponse = new SocialResponse({
                userId: userId,
                responses: {
                    taskId: task[0]._id,
                    score: task[0].score
                }
            })
            await newResponse.save()
        } else {
            await SocialResponse.updateOne({ _id: response[0]._id }, {
                $push: {
                    responses: {
                        taskId: task[0]._id,
                        score: task[0].score
                    }
                }
            })
        }

        // update user balance
        await User.updateOne({ chatId: userId }, {
            $inc: {
                balance: Number(task[0].score)
            }
        })
        // update Earnings collection
        const userEarnings = await Earnings.find({ chatId: userId })
        console.log('userEarnings', userEarnings)
        const time = new Date().toDateString().split(' ').slice(0, 3)
        if (!userEarnings.length) {
            let user = new Earnings({
                chatId: userId,
                earnings: {
                    type: task[0].meta? task[0].meta : 'TOAD Bounty',
                    score: task[0].score,
                    time: time[2] + " " + time[1]
                }
            })
            await user.save()
        } else {
            await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                $push: {
                    earnings: {
                        type: task[0].meta? task[0].meta : 'TOAD Bounty',
                        score: task[0].score,
                        time: time[2] + ' ' + time[1]
                    }
                }
            })
        }
        res.status(200).json({
            success: true,
            msg: "response updated!"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default updateSocialResponse