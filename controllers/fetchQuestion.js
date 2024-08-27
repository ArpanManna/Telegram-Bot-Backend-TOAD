import { Trivia } from "../models/trivia.js"
import { User } from "../models/user.js"
const getQuestion = async (req, res) => {
    const { date, chatId, userName } = req.query
    try {
        const question = await Trivia.find({ date: date })
        // console.log(question)
        let responseStatus
        
        // check if user exists in our database
        const userDetails = await User.find({ chatId: chatId })
        if(userDetails){
            // if exists fetch response status
            responseStatus = await Trivia.find({date: date}, {responses: { $elemMatch: {userId: chatId }}})
        }
        else{
            // register userDetails in Db
            let user = new User({
                chatId: msg.chat.id,
                userName: userName,
                active: true,
                balance: 0,
                referralCount: 0
            })
            await user.save()
        }
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
            difficulty: question[0]? question[0].difficulty : 'Easy',
            score: question[0]? question[0].score : 0,
            correctAnswer: question[0]? question[0].correctAnswer : null,
            balance: balance,
            responseStatus: responseStatus? responseStatus[0] : null
        })
    }catch(error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getQuestion