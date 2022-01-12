const { Telegraf } = require("telegraf");
require("dotenv").config();
const { howFast, speedHistory } = require("./speedtest.js");

///////////////
// Bot setup //
///////////////

const bot = new Telegraf(process.env.BOT_TOKEN);

////////////////////////////
// Shopping list function //
////////////////////////////

const items = [];

bot.hears(["/list", "/print"], (ctx) => {
  let printableList = "";
  items.forEach((item, index) => {
    const itemText = item[0].toUpperCase() + item.slice(1);
    printableList = printableList.concat(index + 1 + ". " + itemText + "\n");
  });
  if (printableList.length > 0) {
    ctx.reply(printableList);
  } else {
    ctx.reply("Sorry, the list is empty");
  }
});

bot.command("/clear", (ctx) => {
  items.splice(0, items.length);
  ctx.reply("The list has been cleared.");
});

// Remove individual items by number
bot.hears("/remove", (ctx) => ctx.reply("Specify which item to remove"));
bot.hears(/\/remove (.+)/, (ctx) => {
  const index = Number(ctx.match[1]) - 1;

  if (isNaN(index) || index < 0 || index > items.length - 1) {
    ctx.reply("Invalid number");
  } else {
    items.splice(index, 1);
  }
});

///////////////////////
// Speedtest commands//
///////////////////////

bot.command("/speed", async (ctx) => {
  const speed = await howFast();
  speedHistory.push(speed);
  console.log(speedHistory);
  ctx.reply(`Speed: ${Math.round(speed)} Mbps`);
});

bot.command("/average", (ctx) => {
  const sum = speedHistory.reduce((a, b) => a + b, 0);
  const avg = sum / speedHistory.length || 0;
  ctx.reply("Average speed is " + Math.round(avg) + " Mbps");
});

bot.command("/reset", (ctx) => {
  speedHistory.splice(0, speedHistory.length);
  ctx.reply("speed history has been reset to 0");
});

// Saves user input for shopping list.
// This function needs to be the last one,
// otherwise all commands are matched to this one
// instead of their correct functions

bot.on("text", (ctx) => {
  const text = ctx.update.message.text;
  if (text[0] === "/") return;
  if (items.includes(text)) return;

  items.push(text);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch();
