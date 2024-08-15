import { User } from "../models/user.js"

const getFriends = async(req,res) => {
    const { chatId } = req.query
    try{
        const friends = await User.find({referredBy: chatId})
        res.status(200).json({
            success: true,
            friendLists: friends.slice(0,10),
            totalFriends: friends? friends.length : 0
        })
    }catch(error){
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getFriends