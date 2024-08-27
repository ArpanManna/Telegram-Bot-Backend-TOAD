import { Earnings } from "../models/earnings.js"

const getEarnings = async (req, res) => {
    const { chatId } = req.query
    try {
        const response = await Earnings.find({ chatId: chatId })
        // sort by date and send last 50 earnings
        if (response) {
            const sortedByDate = response[0].earnings.reverse()
            const slicedEarnings = sortedByDate.slice(0, 50)
            res.status(200).json({
                success: true,
                earnings: slicedEarnings ? slicedEarnings : null
            })
        }
        else {
            return res.status(200).json({
                success: false,
                earnings: null
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getEarnings