import { Trivia } from "../models/trivia.js"
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";

// 1. update Trivia response
// 2. If correct response, add score to user balance 
// 3. If correct response, add score to earnings
const updateEarnings = async (req, res) => {
    const { userId, userName, meta, score } = req.body;

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
        // update user balance
        await User.updateOne({ chatId: userId }, {
            $inc: {
                balance: Number(score)
            }
        })
        // update Earnings collection
        const userEarnings = await Earnings.find({ chatId: userId })
        const time = new Date().toDateString().split(' ').slice(0, 3)
        if (!userEarnings.length) {
            let user = new Earnings({
                chatId: userId,
                earnings: {
                    type: meta,
                    score: score,
                    time: time[2] + " " + time[1]
                }
            })
            await user.save()
        } else {
            await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                $push: {
                    earnings: {
                        type: meta,
                        score: score,
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

export default updateEarnings