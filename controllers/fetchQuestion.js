import { Trivia } from "../models/trivia.js"
import { User } from "../models/user.js"
const getQuestion = async (req, res) => {
    const { date, chatId } = req.query
    try {
        const question = await Trivia.find({ date: date })
        console.log(question)
        const responseStatus = await Trivia.find({ "responses.userId": chatId }, { "responses.$": 1 })
        const userDetails = await User.find({ chatId: chatId })
        let balance = 0;
        if (userDetails) {
            balance = userDetails[0].balance ? userDetails[0].balance : 0
        } else {
            balance = 0;
        }
        res.status(200).json({
            success: true,
            questionId: question[0]? question[0]._id : null,
            question: question[0]? question[0].question : null,
            answerOptions: question[0]? question[0].answers : null,
            difficulty: question[0]? question[0].difficulty : null,
            score: question[0]? question[0].score : null,
            correctAnswer: question[0]? question[0].correctAnswer : null,
            balance: balance,
            responseStatus: responseStatus? responseStatus : null
        })
    }catch(error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getQuestion