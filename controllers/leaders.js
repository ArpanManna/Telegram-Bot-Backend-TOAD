import { User } from "../models/user.js";

const getLeaders = async (req, res) => {
    try {
        const {chatId} = req.query
        const curUser = await User.findOne({chatId})
        const totalHolders = await User.countDocuments()
        const users = await User.find().sort({ balance: -1 }).limit(20)
        const curUserWithRank = await User.aggregate([
            // Add a sequential index field
            { $setWindowFields: { 
                sortBy: { balance: -1 },
                output: {
                  index: { $rank: {} }
                }
            }},
            // Match the document with the specified chatId
            { $match: { chatId: chatId } }
          ])
        
        if (users) {
            const leaders = []
            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                leaders.push({
                    userName: user.userName,
                    balance: user.balance
                })
            }
            res.status(200).json({
                success: true,
                userBalance: curUserWithRank ? curUserWithRank[0].balance : null,
                userRank: curUserWithRank ? curUserWithRank[0].index : null,
                holders: totalHolders,
                leaderboard: leaders
            })
        } else {
            return res.status(400).json({
                success: true,
                userBalance: curUser?curUser.balance:0,
                holders: totalHolders,
                leaderboard: null
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default getLeaders