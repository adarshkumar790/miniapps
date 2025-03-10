import axios from "axios";
import { Telegraf } from "telegraf";

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// import { startBot, setWebAppButton } from "./bot";
// const startBot = require('./bot')
// const setWebAppButton = require('./bot')



const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://AdarshKumar:7903848803@cluster0.bpglqqv.mongodb.net/telegramData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const initDataSchema = new mongoose.Schema({
  id: Number,
  title: String,
  user: Object,
  receiver: Object,
  chat: Object,
  timestamp: { type: Date, default: Date.now },
});


const InitData = mongoose.model('InitData', initDataSchema);


app.post('/api/store', async (req : any, res : any) => {
  try {
    console.log('Received Data:', req.body);

    const newData = new InitData(req.body);
    await newData.save();
    
    console.log('Data successfully saved to MongoDB:', newData);

    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error('Error saving data:', error); 
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// start Bot

export function startBot() {
    const BOT_TOKEN = "7791923708:AAHwxgDzjfe_IlbW49t2wN1KLWJocxEWAtA";
    const bot = new Telegraf(BOT_TOKEN);
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

startBot()



// Function to set the web app button
export const setWebAppButton = async () => {
    const BOT_TOKEN = "7791923708:AAHwxgDzjfe_IlbW49t2wN1KLWJocxEWAtA";
    const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;
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
setWebAppButton()



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
