const { Telegraf } = require("telegraf");
const cron = require('node-cron');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const YOUR_TOKEN = "6098532208:AAEbV7xNVKIDBOPJqP4EgX5rEkIVdxU75po";
const data = [
  '3 điều khiến bạn trở nên đặc biệt:',
  "3 người bạn thấy biết ơn và tại sao",
  "3 điều đơn giản bạn thấy biết ơn",
  " 3 thành tựu nhỏ bạn đạt được ngày hôm nay",
  "Một người bạn cảm thấy vui khi gặp",
  "Mô tả lần gần nhất bạn làm một điều tốt",
  "Một nỗi sợ mà bạn đã vượt qua",
  "3 hoạt động bạn thích thú nhất và tại sao?",
  "Điều gì đã làm bạn cười ngày hôm nay",
  "3 điều bạn thấy thích nhất ở gia đình bạn",
  "Địa điểm ưu thích nhất của bạn ở đâu và tại sao",
  "3 điều bạn thấy thích nhất ở bản thân",
  "1 điều tốt đẹp nhất hôm nay",
  "một điều mới bạn đã học được",
  "3 đồ dùng hàng ngày bạn thấy biết ơn",
  "3 bài hat mang lại niềm vui cho bạn",
  "1 kỹ năng nào bạn thấy biết ơn và tại sao",
  "1 khó khăn mà bạn đã vượt qua",
  "1 sự từ chối nào bạn cảm thấy biết ơn",
  "3 thứ trên cơ thể bạn thấy biết ơn",
  "Mô tả lần gần nhất bạn cười 'chảy nước mắt'",
  "1 thành tựu bạn tự hào nhất"
]

const bot = new Telegraf(YOUR_TOKEN);
bot.help((ctx) => ctx.reply(`
  Available commands:
  /schedul - Schedule wyfls and questions
  /help - Show help
`));

let isSchedule = false;
let wyflsJob = null;
let cardJob = null;

bot.hears(/\/schedule/, (ctx) => {
  const chatId = ctx.message.chat.id;

  if (isSchedule) {
    bot.telegram.sendMessage(chatId, 'Lịch hẹn đã được đặt trước đó.');
    return;
  }

  wyflsJob = cron.schedule('0 21 * * *', () => {
    bot.telegram.sendMessage(chatId, `@all What you feel like saying cả nhà?`);
  }, {
    scheduled: true,
    timezone: 'Asia/Bangkok'
  });

  cardJob = cron.schedule('30 8 * * *', () => {
    const randomText = data[Math.floor(Math.random() * data.length)];
    bot.telegram.sendMessage(chatId, `@all ${randomText}`);
  }, {
    scheduled: true,
    timezone: 'Asia/Bangkok'
  });

  isSchedule = true;
  bot.telegram.sendMessage(chatId, 'Lịch hẹn đã được đặt.');
});

bot.hears(/\/stop/, (ctx) => {
  const chatId = ctx.chat.id;

  if (!isSchedule) {
    bot.telegram.sendMessage(chatId, 'Lịch hẹn chưa được đặt.');
    return;
  }

  wyflsJob.stop();
  cardJob.stop();
  isSchedule = false;

  bot.telegram.sendMessage(chatId, 'Lịch hẹn đã được hủy bỏ.');
});

bot.launch();