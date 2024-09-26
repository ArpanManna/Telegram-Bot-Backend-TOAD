import { PartnerTasks } from "../models/partnerTasks.js";
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";
import { PartnerTasksResponse } from "../models/partnerTasksResponse.js";
// 1. update Task response
// 2. If correct response, add score to user balance 
// 3. If correct response, add score to earnings
const updateSocialResponse = async (req, res) => {
    const { socialTaskId, userId, userName } = req.body;
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

    // update tasks response
    try {
        const task = await PartnerTasks.find({ _id: socialTaskId })
        if (!task) {
            return res.status(400).json({
                success: false,
                error: 'Updation failed. Task not found.'
            })
        }

        const response = await PartnerTasksResponse.find({ userId: userId })
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
            const prevResponse = response[0]?.responses.find((item) => 
                item.taskId.toString() == socialTaskId
            )
            if(prevResponse){
                return res.status(400).json({
                    success: false,
                    msg: "Already responded!"
                })
            }
            await PartnerTasksResponse.updateOne({ _id: response[0]._id }, {
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
                    type: task[0].title? task[0].title : 'TOAD Bounty',
                    score: task[0].score,
                    time: time[2] + " " + time[1]
                }
            })
            await user.save()
        } else {
            await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                $push: {
                    earnings: {
                        type: task[0].title? task[0].title : 'TOAD Bounty',
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