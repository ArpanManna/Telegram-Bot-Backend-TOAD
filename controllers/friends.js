import { User } from "../models/user.js"
import { Earnings } from "../models/earnings.js"

const getFriends = async(req,res) => {
    const { chatId } = req.query
    const response = []
    let totalFriends = 0
    try{
        const friends = await Earnings.find({chatId: chatId})
        const earnings = friends[0].earnings
        
        for(let i=0;i<earnings.length; i++){
            if(earnings[i].type == 'Referral'){
                totalFriends += 1
                response.push({
                    userName: earnings[i].referred ? earnings[i].referred : null,
                    score: earnings[i].score
                })
            }
        }
        res.status(200).json({
            success: true,
            friendLists: response.length >=3 ? response.slice(0,3): response,
            totalFriends: totalFriends
        })
    }catch(error){
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getFriends