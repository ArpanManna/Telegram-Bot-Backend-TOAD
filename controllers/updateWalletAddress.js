import { User } from "../models/user.js";


const updateWallet = async (req, res) => {
    const { userId, userName, walletAddress } = req.body;

    // check if user doesnot exist create user document in db
    try {
        const user = await User.find({ chatId: userId })
        if (!user.length) {
            // create user document
            let newUser = new User({
                chatId: userId,
                userName: userName,
                active: true,
                balance: 0,
                referralCount: 0,
                walletAddress: walletAddress
            })
            await newUser.save()
        }
        else {
            // set member status in user db
            await User.updateOne({ chatId: userId }, {
                $set: {
                    walletAddress: walletAddress
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: 'wallet updated'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default updateWallet