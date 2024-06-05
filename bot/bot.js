import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import dotenv from 'dotenv';
import { config } from "../config.js";
dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`
const DB_CONNECTION_URL = "mongodb://localhost:27017/"

// establish DB connection
mongoose.connect(DB_CONNECTION_URL)
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
        const res = await User.find({ chatId: msg.chat.id })
        if (res.length) {
            const referral_url=`https://t.me/pikapi_community_bot?start=${msg.chat.id}`
            bot.sendMessage(msg.chat.id,
                `Your balance: ${res[0].balance} $TOAD\nReferral count : ${res[0].referralCount}\nYour referral link : ${referral_url}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Share 🤝 & Keep earning",
                                    url: `https://t.me/share/url?url=${referral_url}`,
                                },
                            ],
                        ],
                    }
                }
            )
        }
        else {
            const welcome_msg = `Hi, ${msg.chat.first_name}! This is $${config.symbol}, the official memecoin of Toad community 👋
        $${config.symbol} is a of friend of $BRETT on Base and $PEPE on EThereum. That's all you ever wanted.
        Join ${config.groupId} to kick-start your journey with us!`
            bot.sendMessage(msg.chat.id, welcome_msg, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Join Telegram",
                                url: config.telegramJoiningLink,
                            },
                        ],
                    ],
                }
            })
        }
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
                await User.updateOne({ chatId: referredById }, {
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
        const referral_url=`https://t.me/pikapi_community_bot?start=${msg.new_chat_member.id}`
        bot.sendMessage(msg.new_chat_member.id,
            `Your balance: ${bal} $TOAD
            Referral count : 0
            Your referral link : ${referral_url}`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Share 🤝",
                                url: `https://t.me/share/url?url=${referral_url}`,
                            },
                        ],
                    ],
                }
            }
        )
    }
})