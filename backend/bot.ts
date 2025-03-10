import axios from "axios";
import { Telegraf } from "telegraf";
import express from "express";
import { validate } from "@telegram-apps/init-data-node";

const BOT_TOKEN = "7791923708:AAHwxgDzjfe_IlbW49t2wN1KLWJocxEWAtA";
const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());

console.log("Bot is started");

bot.start((ctx) => {
    const user = ctx.from;

    const initDataRaw = `id=${user.id}&first_name=${user.first_name}&last_name=${user.last_name || ""}&username=${user.username || ""}&language_code=${user.language_code}&is_premium=${user.is_premium || false}`;

    try {
        validateInitData(initDataRaw);
        console.log(`User Verified: ${user.first_name} (ID: ${user.id})`);
        ctx.reply(`Hello, ${user.first_name}! You are verified`);
    } catch (error) {
        console.error(`Verification Failed:`, error);
        ctx.reply(`Hello, ${user.first_name}! Verification failed`);
    }
});


bot.launch();

const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;
const setWebAppButton = async () => {
    try {
        const response = await axios.post(API_URL, {
            menu_button: {
                type: "web_app",
                text: "Rats Kingdom",
                web_app: { url: `https://33fd-2402-a00-152-cd37-bf2d-791d-4548-54ed.ngrok-free.app` },
            },
        });
        console.log("Menu Button Set:", response.data);
    } catch (error) {
        console.error("Error setting menu button:", error);
    }
};

setWebAppButton();

const validateInitData = (initDataRaw: string) => {
    validate(initDataRaw, BOT_TOKEN);
};

export default validateInitData;


