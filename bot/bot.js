import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import dotenv from 'dotenv';
import { config } from "../config.js";
dotenv.config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`

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
        const res = await User.find({ chatId: msg.chat.id })
        if (res.length) {
            const referral_url = `https://t.me/${config.botUserName}?start=${msg.chat.id}`
            bot.sendMessage(msg.chat.id,
                `💰 Earnings: ${res[0].balance} $TOAD\n👬 Referral count : ${res[0].referralCount}\n\nRefer friends to receive additional $TOAD tokens!\n\nFor every seuucessful referral to the Toad Community chat, you will receive ${config.referralBonus} tokens, that will be applicable to any future $TOAD token distribution.\n\n👉 Share this referral link : ${referral_url} or click below ⬇️`,
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
            const image_link = "/Users/arpan/Documents/telegram-bot-backend/public/img.png"

            const welcome_msg = `👋 Hi, ${msg.chat.first_name}!\n\n🔗 Join *${config.groupName}* chat to receive ${config.joiningBonus} $TOAD tokens and shape the future of Toad  🐸!\n\n❓ *Why should you join the Toad Community?*\n\n🎉 Receive ${config.joiningBonus} $TOAD tokens as welcome bonus\n💡 Engage in insightful discussions\n📢 Access to exclusive updates and announcements\n🤝 Improve Toad by sharing feedback and voting on proposals\n✨ Be an integral part of $TOAD token launch\n\n⬇️ Click the button below to join Toad Community!`
            // await bot.sendPhoto(msg.chat.id, "/Users/arpan/Documents/telegram-bot-backend/public/img.png")
            bot.sendMessage(msg.chat.id, welcome_msg, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Join Now",
                                url: config.telegramJoiningLink,
                            },
                        ],
                    ],
                },
                parse_mode: "Markdown"
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
        const welcome_msg = `👋 Hi, ${msg.chat.first_name}!\n\n🔗 Join *${config.groupName}* chat to receive ${config.joiningBonus} $TOAD tokens and shape the future of Toad  🐸!\n\n❓ *Why should you join the Toad Community?*\n\n🎉 Receive ${config.joiningBonus} $TOAD tokens as welcome bonus\n💡 Engage in insightful discussions\n📢 Access to exclusive updates and announcements\n🤝 Improve Toad by sharing feedback and voting on proposals\n✨ Be an integral part of $TOAD token launch\n\n⬇️ Click the button below to join Toad Community!`
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
            },
            parse_mode: "Markdown"
        })
    }
})


bot.on('message', async (msg) => {
    console.log(msg)
    if (msg.new_chat_member) {
        // update db
        try {
            const res = await User.find({ chatId: msg.new_chat_member.id })
            // console.log(referredById)
            console.log(res)
            if (res.length) {
                // update user joining balance
                await User.updateOne({ chatId: msg.new_chat_member.id }, {
                    $set: {
                        userName: msg.new_chat_member.username,
                        active: true,
                        balance: config.joiningBonus
                    }
                })
                const referredById = res[0].referredBy

                // update referrer balance and referral count
                await User.updateOne({ chatId: referredById }, {
                    $inc: {
                        referralCount: 1,
                        balance: config.referralBonus
                    }
                })
            }
            else {
                let user = new User({
                    chatId: msg.new_chat_member.id,
                    userName: msg.new_chat_member.username,
                    active: true,
                    balance: config.joiningBonus,
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
        const referral_url = `https://t.me/${config.botUserName}?start=${msg.new_chat_member.id}`
        bot.sendMessage(msg.new_chat_member.id,
            `💵 You have earned ${bal} $TOAD 🎉.\n\nRefer friends to receive additional $TOAD tokens!\nFor every successful referral to the Toad Community chat, you will receive ${config.referralBonus} tokens, that will be applicable to any future $TOAD token distribution.\n\n👉 Share this referral link : ${referral_url} or click below ⬇️`,
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
