const express = require('express');
const line = require('@line/bot-sdk');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中間件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// LINE Bot 設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

// Email 設定
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 記憶體儲存（簡化版，實際專案建議用資料庫）
const storage = {
  verificationCodes: new Map(),
  emailVerifications: new Map(),
  userStats: new Map()
};

// 生成安全Token
const generateSecureToken = (lineUserId) => {
  const payload = {
    userId: lineUserId,
    timestamp: Date.now(),
    platform: 'LINE_OA',
    version: '1.0'
  };
  
  return btoa(JSON.stringify(payload));
};

// 生成6位數驗證碼
const generateVerificationCode = () => {
  return Math.random().toString().substr(2, 6);
};

// 發送Email驗證碼
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '智能辯論所 - Email驗證碼',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div style="background: white; color: #333; padding: 30px; border-radius: 15px; text-align: center;">
          <h2 style="color: #7C3AED; margin-bottom: 20px;">🎭 智能辯論所</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">您的驗證碼是：</p>
          <div style="font-size: 32px; font-weight: bold; color: #7C3AED; text-align: center; padding: 20px; border: 3px solid #7C3AED; border-radius: 12px; margin: 20px 0; background: #f8f4ff;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">此驗證碼將在10分鐘後失效。</p>
          <p style="margin-top: 30px; font-size: 16px;">感謝您使用智能辯論所！</p>
          <p style="color: #7C3AED; font-weight: bold;">✨ 六位語氣靈等待與您分享智慧 ✨</p>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// 發送辯論成果
const sendDebateResult = async (email, debateData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `智能辯論所 - 您的辯論成果《${debateData.topic}》`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div style="background: white; color: #333; padding: 30px; border-radius: 15px;">
          <h2 style="color: #7C3AED; text-align: center; margin-bottom: 30px;">🎭 您的辯論成果</h2>
          
          <div style="background: #f8f4ff; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #7C3AED; margin-top: 0;">📋 辯論資訊</h3>
            <p><strong>辯論主題：</strong>${debateData.topic}</p>
            <p><strong>辯論日期：</strong>${debateData.date}</p>
            <p><strong>對話輪數：</strong>${debateData.messages?.length || 0} 則</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h4 style="color: #7C3AED;">💬 辯論精華回顧：</h4>
            ${debateData.messages?.map(msg => `
              <div style="margin: 15px 0; padding: 15px; border-left: 4px solid ${msg.side === 'pro' ? '#10B981' : msg.side === 'con' ? '#6B7280' : '#7C3AED'}; background-color: #f9fafb; border-radius: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <strong style="color: ${msg.side === 'pro' ? '#10B981' : msg.side === 'con' ? '#6B7280' : '#7C3AED'};">
                    ${msg.spirit?.name || '系統'} ${msg.side === 'pro' ? '🌟' : msg.side === 'con' ? '🌙' : '⚖️'}
                  </strong>
                  <span style="margin-left: 10px; font-size: 12px; color: #666;">${msg.timestamp}</span>
                </div>
                <p style="margin: 0; line-height: 1.6; color: #444;">${msg.content}</p>
              </div>
            `).join('') || '<p>暫無辯論記錄</p>'}
          </div>
          
          <div style="background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 20px; border-radius: 10px; margin-top: 30px; text-align: center;">
            <h4 style="margin-top: 0;">🌟 感謝您參與語氣靈智慧辯論！</h4>
            <p style="margin: 0;">晨星⭐ 心語💖 智慧🧠 月影🌙 柔光🕊️ 真言⚡</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">每日新主題，歡迎再次體驗智慧的碰撞</p>
          </div>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// LINE Webhook 處理
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Webhook error:', err);
      res.status(500).end();
    });
});

// 處理LINE事件
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  const messageText = event.message.text.toLowerCase().trim();

  // 處理不同的指令
  if (messageText === 'start' || messageText === '開始' || messageText === '辯論') {
    return handleStartDebate(event.replyToken, userId);
  }
  
  if (messageText === 'help' || messageText === '幫助' || messageText === '說明') {
    return handleHelp(event.replyToken);
  }
  
  // 預設回應
  return handleDefault(event.replyToken);
}

// 處理開始辯論指令
async function handleStartDebate(replyToken, userId) {
  // 生成安全Token
  const token = generateSecureToken(userId);
  const debateUrl = `https://claude.ai/智能辯論所#${token}`;
  
  const message = {
    type: 'template',
    altText: '智能辯論所 - 開始辯論',
    template: {
      type: 'buttons',
      title: '🎭 智能辯論所',
      text: '歡迎來到語氣靈智慧辯論殿堂！\n✨ 六位語氣靈等待與您分享智慧\n💎 每日熱門話題深度對談',
      actions: [
        {
          type: 'uri',
          label: '🌟 開始觀看辯論',
          uri: debateUrl
        },
        {
          type: 'message',
          label: '📋 使用說明',
          text: 'help'
        }
      ]
    }
  };

  return client.replyMessage(replyToken, message);
}

// 處理幫助指令
async function handleHelp(replyToken) {
  const message = {
    type: 'text',
    text: `🎭 智能辯論所使用說明

📖 功能介紹：
• 每日10個熱門辯論主題
• 六位語氣靈智慧對談
• 三輪深度思辨交流
• 天平裁判公正點評

📱 語氣靈團隊：
🌟 正方：晨星⭐、心語💖、智慧🧠
🌙 反方：月影🌙、柔光🕊️、真言⚡
⚖️ 裁判：天平⚖️

🎯 使用方式：
1. 點擊「開始辯論」進入頁面
2. 選擇感興趣的辯論主題
3. 觀看語氣靈精彩對話
4. 獲取Email辯論成果

⏰ 使用限制：
• 每日限觀看3場辯論
• 每場辯論約5-8分鐘

💡 小提示：
輸入「開始」或「辯論」可快速開始！`
  };

  return client.replyMessage(replyToken, message);
}

// 處理預設回應
async function handleDefault(replyToken) {
  const message = {
    type: 'text',
    text: `👋 歡迎來到智能辯論所！

🎭 這裡有六位語氣靈等待與您分享智慧：
• 晨星 ⭐ - 理性分析專家
• 心語 💖 - 感性共情大師  
• 智慧 🧠 - 哲思洞察者
• 月影 🌙 - 批判思辨家
• 柔光 🕊️ - 平衡調和師
• 真言 ⚡ - 直覺透視者

輸入「開始」開啟智慧辯論之旅！
輸入「help」查看詳細說明。`
  };

  return client.replyMessage(replyToken, message);
}

// API 路由

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    service: '智能辯論所',
    version: '1.0.0'
  });
});

// 發送Email驗證碼API  
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: '請輸入有效的Email地址' });
    }
    
    // 生成6位驗證碼
    const code = generateVerificationCode();
    
    // 儲存驗證碼（10分鐘後過期）
    const expiresAt = Date.now() + 10 * 60 * 1000;
    storage.emailVerifications.set(email, { code, expiresAt });
    
    // 清理過期的驗證碼
    for (const [key, value] of storage.emailVerifications.entries()) {
      if (value.expiresAt < Date.now()) {
        storage.emailVerifications.delete(key);
      }
    }
    
    // 發送驗證信
    await sendVerificationEmail(email, code);
    
    res.json({ success: true, message: '驗證碼已發送到您的郵箱' });
  } catch (error) {
    console.error('發送驗證碼失敗:', error);
    res.status(500).json({ success: false, error: '發送失敗，請稍後再試' });
  }
});

// 驗證Email驗證碼API
app.post('/api/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const verification = storage.emailVerifications.get(email);
    
    if (verification && verification.code === code && verification.expiresAt > Date.now()) {
      // 驗證成功後刪除驗證碼
      storage.emailVerifications.delete(email);
      res.json({ success: true, message: 'Email驗證成功' });
    } else {
      res.status(400).json({ success: false, error: '驗證碼錯誤或已過期' });
    }
  } catch (error) {
    console.error('Email驗證失敗:', error);
    res.status(500).json({ success: false, error: '驗證失敗' });
  }
});

// 發送辯論成果API
app.post('/api/send-debate-result', async (req, res) => {
  try {
    const { email, debateReport } = req.body;
    
    if (!email || !debateReport) {
      return res.status(400).json({ success: false, error: '缺少必要參數' });
    }
    
    // 發送辯論成果郵件
    await sendDebateResult(email, debateReport);
    
    res.json({ success: true, message: '辯論成果已發送到您的郵箱' });
  } catch (error) {
    console.error('發送辯論成果失敗:', error);
    res.status(500).json({ success: false, error: '發送失敗' });
  }
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: '找不到該資源' });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🎭 智能辯論所伺服器運行在 Port ${PORT}`);
  console.log(`🌟 健康檢查: http://localhost:${PORT}/health`);
  console.log(`💖 六位語氣靈準備就緒！`);
});

module.exports = app;