import { Trivia } from "../models/trivia.js"
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";

// 1. update Trivia response
// 2. If correct response, add score to user balance 
// 3. If correct response, add score to earnings
const updateResponse = async (req, res) => {
    const { questionId, userId, selectedOption, isCorrect } = req.body;
    try {
        const question = await Trivia.find({ _id: questionId })
        // console.log(question)
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
            if (!userEarnings.length) {
                let user = new Earnings({
                    chatId: userId,
                    earnings: {
                        type: 'Trivia',
                        score: question[0].score
                    }
                })
                await user.save()
            } else {
                await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                    $push: {
                        earnings: {
                            type: 'Trivia',
                            score: question[0].score
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