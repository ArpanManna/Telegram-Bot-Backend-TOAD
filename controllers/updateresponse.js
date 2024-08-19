import { Trivia } from "../models/trivia.js"
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";

// 1. update Trivia response
// 2. If correct response, add score to user balance 
// 3. If correct response, add score to earnings
const updateResponse = async (req, res) => {
    const { questionId, userId, userName, selectedOption, isCorrect } = req.body;
    // check if user doesnot exist create user document in db
    try {
        const user = User.find({ chatId: userId })
        if (!user.length) {
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
        console.log(error)
    }
    try {
        const question = await Trivia.find({ _id: questionId })
        console.log(question)
        await Trivia.updateOne({ _id: questionId }, {
            $push: {
                responses: {
                    userId: userId,
                    selectedOption: selectedOption,
                    isCorrect: isCorrect
                }
            }
        })
        if (isCorrect) {
            // update user balance
            await User.updateOne({ chatId: userId }, {
                $inc: {
                    balance: Number(question[0].score)
                }
            })
            // update Earnings collection
            const userEarnings = await Earnings.find({ chatId: userId })
            const time = new Date().toDateString().split(' ').slice(0, 3)
            if (!userEarnings.length) {
                let user = new Earnings({
                    chatId: userId,
                    earnings: {
                        type: 'Trivia',
                        score: question[0].score,
                        time: time[2] + " " + time[1]
                    }
                })
                await user.save()
            } else {
                await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                    $push: {
                        earnings: {
                            type: 'Trivia',
                            score: question[0].score,
                            time: time[2] + ' ' + time[1]
                        }
                    }
                })
            }
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

export default updateResponse