import { Trivia } from "../models/trivia.js"

const updateResponse = async (req, res) => {
    const { questionId, userId, selectedOption, isCorrect } = req.body;
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