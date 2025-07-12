// Xeon-Xtech config.js
const fs = require("fs");
require("dotenv").config();

const config = {
  // 👑 Owner & Permissions
  OWNER_NAME: process.env.OWNER_NAME || "Black-Tappy",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254794344429",
  SUDO_NUMBER: process.env.SUDO_NUMBER || "254794344429",
  
  // 🧠 Core Bot Identity & Information
  SESSION_ID: process.env.SESSION_ID || "XEON-XTECH~1MB01YCZ#Ac9X2hepEJuE-hZzhL7HFJ1r6QSy7ti-4NiXGMJ6X9Q",
  PREFIX: process.env.PREFIX || '.',
  BOT_NAME: process.env.BOT_NAME || "Xeon-Xtech",
  BOT: process.env.BOT || "hello 👋", 
  NEW_CMD: process.env.NEW_CMD || "ᴀᴅᴅᴠᴀʀ\n│ sᴜᴅᴏ\n| bright",
  CAPTION: process.env.CAPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ",
  MODE: process.env.MODE || "private",

  // 🤖 AI & API Keys
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  GROQ_API_KEY: process.env.GROQ_API_KEY || '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',
  // (Added from example for completeness)
  GPT_API_KEY: process.env.GPT_API_KEY || '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', // Groq key
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || "ec32bfa1c6b8ff81a636877b6ba302c8",
  PRINCETECH_APIKEY: process.env.PRINCETECH_APIKEY || "prince_api_tjhv",

  // 🔧 Automation Features
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true,
  AUTO_BIO: process.env.AUTO_BIO !== undefined ? process.env.AUTO_BIO === 'true' : true,
  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT !== undefined ? process.env.AUTO_STATUS_REACT === 'true' : true,
  AUTOLIKE_EMOJI: process.env.AUTOLIKE_EMOJI || '💚',
  AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS !== undefined ? process.env.AUTO_REPLY_STATUS === 'true' : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || 'Status Viewed by Xeon-Xtech',
  VOICE_CHAT_BOT: process.env.VOICE_CHAT_BOT !== undefined ? process.env.VOICE_CHAT_BOT === 'true' : false,
  AUTO_STICKER: process.env.AUTO_STICKER !== undefined ? process.env.AUTO_STICKER === 'true' : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'true' : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'true' : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'true' : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === 'true' : false,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'true' : false,

  // 🛡️ Moderation & Group Management
  ANTI_LEFT: process.env.ANTI_LEFT !== undefined ? process.env.ANTI_LEFT === 'true' : true,
  ANTILINK: process.env.ANTILINK !== undefined ? process.env.ANTILINK === 'true' : false,
  ANTI_DELETE: process.env.ANTI_DELETE !== undefined ? process.env.ANTI_DELETE === 'true' : false,
  DELETED_MESSAGES_CHAT_ID: process.env.DELETED_MESSAGES_CHAT_ID || "254794344429@s.whatsapp.net",
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'true' : false, 
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'true' : true,
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'true' : true,
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'true' : false,
  // (Added from example for completeness)
  MASS_TARGET_JID: process.env.MASS_TARGET_JID || "254794344429@s.whatsapp.net",
  BLOCK_UNKNOWN: process.env.BLOCK_UNKNOWN !== undefined ? process.env.BLOCK_UNKNOWN === 'true' : false,

  // 💬 AI Chatbot Features
  CHAT_BOT: process.env.CHAT_BOT !== undefined ? process.env.CHAT_BOT === 'true' : false, // This is often overridden by the specific modes below
  CHAT_BOT_MODE: process.env.CHAT_BOT_MODE || "public", 
  CHATBOT_PRIVATE: process.env.CHATBOT_PRIVATE !== undefined ? process.env.CHATBOT_PRIVATE === 'true' : false,
  CHATBOT_GROUP: process.env.CHATBOT_GROUP !== undefined ? process.env.CHATBOT_GROUP === 'true' : false,
  LYDEA: process.env.LYDEA !== undefined ? process.env.LYDEA === 'true' : false,

  // 📊 Status Command Features
  STATUS: process.env.STATUS !== undefined ? process.env.STATUS === 'true' : false,
  DEPLOY_DATE: process.env.DEPLOY_DATE || "2025-05-25",
  TARGET_NUMBER: process.env.TARGET_NUMBER || "254794344429",
};

module.exports = config;
