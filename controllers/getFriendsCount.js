import { User } from "../models/user.js"

const getFriendsCount = async(req,res) => {
    const { chatId } = req.query
    try{
        const userDetails = await User.find({ chatId: chatId })
        res.status(200).json({
            success: true,
            totalFriends: userDetails? userDetails[0].referralCount : 0
        })
    }catch(error){
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getFriendsCount