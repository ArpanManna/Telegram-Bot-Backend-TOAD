import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";
import { config } from "../config.js";

const updateMembership = async (req, res) => {
    const { userId, userName } = req.body;

    // check if user doesnot exist create user document in db
    try {
        const user = await User.find({ chatId: userId })
        if (!user.length) {
            const newUser = new User({
                chatId: userId,
                userName: userName,
                active: true,
                balance: Number(config.joiningBonus),
                referralCount: 0,
                member: true
            })
            await newUser.save()

            // create earnings collection
            const time = new Date().toDateString().split(' ').slice(0, 3)
            const userEarnings = new Earnings({
                chatId: userId,
                earnings: {
                    type: 'Joining Bonus',
                    score: config.joiningBonus,
                    time: time[2] + " " + time[1]
                }
            })
            await userEarnings.save()
        }
        else {
            // set member status in user db
            await User.updateOne({ chatId: userId }, {
                $set: {
                    member: true
                }
            })
            // update user balance
            await User.updateOne({ chatId: userId }, {
                $inc: {
                    balance: Number(config.joiningBonus)
                }
            })
            // update Earnings collection
            const userEarnings = await Earnings.find({ chatId: userId })
            const time = new Date().toDateString().split(' ').slice(0, 3)
            await Earnings.updateOne({ _id: userEarnings[0]._id }, {
                $push: {
                    earnings: {
                        type: 'Joining Bonus',
                        score: config.joiningBonus,
                        time: time[2] + ' ' + time[1]
                    }
                }
            })
        }
        res.status(200).json({
            success: true,
            data: 'updated'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }

}

export default updateMembership