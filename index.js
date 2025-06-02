import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';

import { fileURLTopath } from 'url';

const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;
const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
const whatsappChannelId = '0029VajweHxKQuJP6qnjLM31@newsletter'; // Ensure this is the correct format


const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("POPKID;;;")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("🔄 Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download session data:', error);
        return false;
    }
}
  //=============autobio=======
const lifeQuotes = [
  "The only way to do great work is to love what you do.",
  "Strive not to be a success, but rather to be of value.",
  "The mind is everything. What you think you become.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Life is what happens when you're busy making other plans.",
  "Be the change that you wish to see in the world.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is never too late to be what you might have been.",
  "Do not wait to strike till the iron is hot; but make the iron hot by striking.",
  "The journey of a thousand miles begins with a single step."
];

async function updateBio(Matrix) {
  try {
    const now = moment().tz('Africa/Nairobi');
    const time = now.format('HH:mm:ss');
    const randomIndex = Math.floor(Math.random() * lifeQuotes.length);
    const randomQuote = lifeQuotes[randomIndex];
    const bio = `🧋ᴘᴏᴘᴋɪᴅ xᴍᴅ ɪs ᴀᴄᴛɪᴠᴇ🧋ᴀᴛ ${time} | ${randomQuote}`;
    await Matrix.updateProfileStatus(bio);
    console.log(chalk.yellow(`ℹ️ Bio updated to: "${bio}"`));
  } catch (error) {
    console.error(chalk.red('Failed to update bio:'), error);
  }
}

async function updateLiveBio(Matrix) {
  try {
    const now = moment().tz('Africa/Nairobi');
    const time = now.format('HH:mm:ss');
    const bio = `🧋ᴘᴏᴘᴋɪᴅ xᴍᴅ ɪs ᴀᴄᴛɪᴠᴇ🧋ᴀᴛ ${time}`;
    await Matrix.updateProfileStatus(bio);
  } catch (error) {
    console.error(chalk.red('Failed to update live bio:'), error);
  }
}
  //=============autobio=======
async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 XEON-XMD using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["XEON-XMD", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: " xeon ai whatsapp user bot" };
            }
        });

Matrix.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            start();
        }
    } else if (connection === 'open') {
        if (initialConnection) {
          console.log(chalk.green("✔️ ᴘᴏᴘᴋɪᴅ ᴍᴅ ɪs ɴᴏᴡ ᴏɴʟɪɴᴇ ᴀɴᴅ ᴘᴏᴡᴇʀᴇᴅ ᴜᴘ"));
          await updateBio(Matrix);
          const image = { url: "https://files.catbox.moe/nk71o3.jpg" };
          const caption = `╭━━ *『 ᴘᴏᴘᴋɪᴅ xᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ 』*

┃
┃ |⚡| ʙᴏᴛ ɴᴀᴍᴇ: ᴘᴏᴘᴋɪᴅ xᴍᴅ
┃ |👑| ᴏᴡɴᴇʀ: ᴘᴏᴘᴋɪᴅ
┃ |⚙️| ᴍᴏᴅᴇ: ${config.MODE}
┃ |🎯| ᴘʀᴇꜰɪx: ${config.PREFIX}
┃ |✅| ꜱᴛᴀᴛᴜꜱ: ᴏɴʟɪɴᴇ & ꜱᴛᴀʙʟᴇ
┃
╰━━━━━━━━━━━━━━━━━━━╯

ɪᴛs ʏᴏᴜ,ᴍᴇ,ᴜs🧋🩷.

╭──────────────────
│ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ
╰──────────────────
🔗 Follow my WhatsApp Channel: ${whatsappChannelLink}`;

          await Matrix.sendMessage(Matrix.user.id, {
            image,
            caption,
            contextInfo: {
              isForwarded: true,
              forwardingScore: 999,
              forwardedNewsletterMessageInfo: {
                newsletterJid: whatsappChannelId,
                newsletterName: "popkid xmd ʙᴏᴛ",
                serverMessageId: -1,
              },
              externalAdReply: {
                title: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
                body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ",
                thumbnailUrl: 'https://files.catbox.moe/nk71o3.jpg',
                sourceUrl: whatsappChannelLink,
                mediaType: 1,
                renderLargerThumbnail: false,
              },
            },
          });

          try {
            await Matrix.sendMessage(Matrix.user.id, {
              text: `📢 Automatically following my WhatsApp channel: ${whatsappChannelLink}`,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
              }
            });

            // Attempt to follow the channel
            await Matrix.store.follow(whatsappChannelId);
            console.log(chalk.green(`✅ Automatically followed WhatsApp channel: ${whatsappChannelLink}`));

          } catch (error) {
            console.error(chalk.yellow(`⚠️ Failed to automatically follow WhatsApp channel: ${error}`));
            await Matrix.sendMessage(Matrix.user.id, {
              text: `⚠️ Failed to automatically follow my WhatsApp channel. You can follow it manually here: ${whatsappChannelLink}`,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
              }
            });
          }


          if (!global.isLiveBioRunning) {
            global.isLiveBioRunning = true;
            setInterval(async () => {
              await updateLiveBio(Matrix);
            }, 10000);
          }
          initialConnection = false;
        } else {
          console.log(chalk.blue("♻️ Connection reestablished after restart."));
          if (!global.isLiveBioRunning) {
            global.isLiveBioRunning = true;
            setInterval(async () => {
              await updateLiveBio(Matrix);
            }, 10000);
          }
        }
      }
    });
        
        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                console.log(mek);
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    console.log(mek);
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto reaction:', err);
            }
        });
        
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const mek = chatUpdate.messages[0];
        const fromJid = mek.key.participant || mek.key.remoteJid;
        if (!mek || !mek.message) return;
        if (mek.key.fromMe) return;
        if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return; 
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
            await Matrix.readMessages([mek.key]);
          
  //=============readstatus=======
        
    //console.log("New Message Detected:", JSON.stringify(mek, null, 2));
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const mek = chatUpdate.messages[0];
        const fromJid = mek.key.participant || mek.key.remoteJid;
        if (!mek || !mek.message) return;
        if (mek.key.fromMe) return;
        if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return; 
  if (config.READ_MESSAGE === 'true') {
    await conn.readMessages([mek.key]);  // Mark message as read
    console.log(`Marked message from ${mek.key.remoteJid} as read.`);
  }
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const mek = chatUpdate.messages[0];
        const fromJid = mek.key.participant || mek.key.remoteJid;
        if (!mek || !mek.message) return;
        if (mek.key.fromMe) return;
        if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return; 
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
        const jawadlike = await conn.decodeJid(conn.user.id);
        const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '🎎', '🎏', '🎐', '⚽', '🧣', '🌿', '⛈️', '🌦️', '🌚', '🌝', '🙈', '🙉', '🦖', '🐤', '🎗️', '🥇', '👾', '🔫', '🐝', '🦋', '🍓', '🍫', '🍭', '🧁', '🧃', '🍿', '🍻', '🎀', '🧸', '👑', '〽️', '😳', '💀', '☠️', '👻', '🔥', '♥️', '👀', '🐼'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    await conn.sendMessage(mek.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: mek.key,
      } 
    }, { statusJidList: [mek.key.participant, jawadlike] });
  }                       
  //============================== 
            if (config.AUTO_STATUS_REPLY) {
                const customMessage = config.STATUS_READ_MSG || '✅ Auto Status Seen Bot By XEON-XMD';
                await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
            }
        }
    } catch (err) {
        console.error('Error handling messages.upsert event:', err);
    }
});

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

async function init() {
    global.isLiveBioRunning = false;
    if (fs.existsSync(credsPath)) {
        console.log("🔒 Session file found, proceeding without QR code.");
        await start();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("🔒 Session downloaded, starting bot.");
            await start();
        } else {
            console.log("No session found or downloaded, QR code will be printed for authentication.");
            useQR = true;
            await start();
        }
    }
}

init();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

