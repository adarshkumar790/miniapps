import axios from "axios";
import { Telegraf } from "telegraf";
import express from "express";
import { validate } from "@telegram-apps/init-data-node";

const BOT_TOKEN = "7791923708:AAHwxgDzjfe_IlbW49t2wN1KLWJocxEWAtA";
const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());

console.log("Bot is started");

// Function to start the bot
export function startBot() {
    bot.start((ctx) => {
        const user = ctx.from;
    
        // const initDataRaw = `id=${user.id}&first_name=${user.first_name}&last_name=${user.last_name || ""}&username=${user.username || ""}&language_code=${user.language_code}&is_premium=${user.is_premium || false}`;
    
        // try {
        //     validateInitData(initDataRaw);
        //     console.log(`User Verified: ${user.first_name} (ID: ${user.id})`);
        //     ctx.reply(`Hello, ${user.first_name}! You are verified`);
        // } catch (error) {
        //     console.error(`Verification Failed:`, error);
        //     ctx.reply(`Hello, ${user.first_name}! Verification failed`);
        // }
    });
    
    bot.launch();
}

// API URL to set the menu button
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;

// Function to set the web app button
export const setWebAppButton = async () => {
    try {
        const response = await axios.post(API_URL, {
            menu_button: {
                type: "web_app",
                text: "Rats Kingdom",
                web_app: { url: `https://50e3-2402-a00-152-cd37-bf2d-791d-4548-54ed.ngrok-free.app` },
            },
        });
        console.log("Menu Button Set:", response.data);
    } catch (error) {
        console.error("Error setting menu button:", error);
    }
};

// Function to validate init data
// export const validateInitData = (initDataRaw: string) => {
//     try {
//         validate(initDataRaw, BOT_TOKEN);
//     } catch (error) {
//         console.error(`Verification Failed:`, error);
//         throw error;  // Re-throw to propagate error if needed
//     }
// };

setWebAppButton();

