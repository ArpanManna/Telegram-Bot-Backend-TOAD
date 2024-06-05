import TelegramBot from "node-telegram-bot-api";
import { botConfig } from "../config/bot.js";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`
const DB_CONNECTION_URL = "mongodb://localhost:27017/"

mongoose.connect(DB_CONNECTION_URL)
    .then(
        () => console.log("Database connected!")
    )
    .catch(
        error => console.log(error)
    )


const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
})

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
    // console.log(msg)
    // console.log(match)
    if (match.input == "/start") {
        const welcome_msg = `Hi, ${msg.chat.first_name}! This is $TOAD, the official memecoin of Toad community
        Join @toad_test to kick-start your journey with us!`
        bot.sendMessage(msg.chat.id, welcome_msg, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Join Telegram",
                            url: "https://t.me/+QVXnumzIcEE0YjQ1",
                        },
                    ],
                ],
            }
        })
    } else {
        const referredById = match.input.split(" ")[1]
        console.log(match.input.split(" ")[1])
        let user = new User({
            chatId: msg.chat.id,
            referredBy: referredById
        })
        await user.save()
    }
})


bot.on('message', async (msg) => {
    console.log(msg)
    if (msg.new_chat_member) {
        // update db
        try {
            const res = await User.find({ chatId: msg.new_chat_member.id })
            const referredById = res[0].referredBy
            console.log(referredById)
            console.log(res)
            if (res.length) {
                // update user joining balance
                await User.updateOne({ chatId: msg.new_chat_member.id }, {
                    $set: {
                        userName: msg.new_chat_member.username,
                        active: true,
                        balance: 3000
                    }
                })
                // update referrer balance and referral count
                await User.updateOne({chatId: referredById}, {
                    $inc: {
                        referralCount: 1,
                        balance: 1000
                    }
                })
            }
            else {
                let user = new User({
                    chatId: msg.new_chat_member.id,
                    userName: msg.new_chat_member.username,
                    active: true,
                    balance: 5000,
                    referralCount: 0
                })
                await user.save()
            }
        } catch (error) {
            console.log(error)
        }
        // fetch user balance
        const res = await User.find({ chatId: msg.new_chat_member.id })
        const bal = res[0].balance
        // send message to user chat
        bot.sendMessage(msg.new_chat_member.id,
            `Your balance: ${bal} $TOAD
            Your referral link : https://t.me/pikapi_community_bot?start=msg.new_chat_member.id`
        )
    }
})