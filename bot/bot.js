import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Earnings } from "../models/earnings.js";
import dotenv from 'dotenv';
import { config } from "../config.js";

dotenv.config();

// establish DB connection
mongoose.connect(process.env.DB_CONNECTION_URL)
    .then(
        () => console.log("Database connected!")
    )
    .catch(
        error => console.log(error)
    )

// start Telegram bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
})

// update bot webhook events
async () => {
    await bot.setWebHook("", {
        allowed_updates: JSON.stringify(
            [
                "message",
                "edited_channel_post",
                "callback_query",
                "message_reaction",
                "message_reaction_count",
                "chat_memeber"
            ]
        )
    })
}


bot.onText(/\/start/, async (msg, match) => {
    if (match.input == "/start") {
        console.log(msg)
        const res = await User.find({ chatId: msg.chat.id })
        if (!res.length) {
            let user = new User({
                chatId: msg.chat.id,
                userName: msg.chat.username,
                active: true,
                balance: 0,
                referralCount: 0
            })
            await user.save()
        }
    } else {
        // coming first time from a referral link
        const referredById = match.input.split(" ")[1]
        // find user in db
        const res = await User.find({ chatId: msg.chat.id })
        // no user -> create an entry
        if (!res.length) {
            let user = new User({
                chatId: msg.chat.id,
                userName: msg.chat.username,
                active: true,
                balance: 0,
                referralCount: 0,
                referredBy: referredById
            })
            await user.save()

            // update referrer balance and referral count
            await User.updateOne({ chatId: referredById }, {
                $inc: {
                    referralCount: 1,
                    balance: config.referralBonus
                }
            })
            const referrarEarnings = await Earnings.find({ chatId: referredById })
            if (!referrarEarnings.length) {
                let user = new Earnings({
                    chatId: referredById,
                    earnings: {
                        type: 'Referral',
                        score: config.referralBonus,
                        time: time[2] + " " + time[1],
                        referred: msg.chat.username
                    }
                })
                await user.save()
            } else {
                // update earnings collection for referrer bonus
                await Earnings.updateOne({ chatId: referredById }, {
                    $push: {
                        earnings: {
                            type: 'Referral',
                            score: config.referralBonus,
                            time: time[2] + ' ' + time[1],
                            referred: msg.chat.username
                        }
                    }
                })
            }

        }

    }
})
