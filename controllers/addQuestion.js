import { Trivia } from "../models/trivia.js"

const addQuestion = async (req, res) => {
    const {date, questionText, option1, option2, option3, option4, correctOption, difficulty, score} = req.body;
    const newQuestion = new Trivia({
        date: date,
        question: questionText,
        answers: [option1, option2, option3, option4],
        difficulty: difficulty,
        score: score,
        correctAnswer: correctOption
    })
    await newQuestion.save()
    res.status(200).json({
        success: true,
        msg: "added"
    })
}

export default addQuestion