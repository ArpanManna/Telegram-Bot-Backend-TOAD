import { Earnings } from "../models/earnings.js"

const getEarnings = async (req, res) => {
    const { chatId } = req.query
    try {
        const response = await Earnings.find({ chatId: chatId })
        console.log(response)
        
        res.status(200).json({
            success: true,
            earnings: response[0].earnings ? response[0].earnings : null
        })
    }catch(error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getEarnings