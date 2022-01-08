///////////////
// Bot setup //
///////////////

const { Telegraf } = require("telegraf");
require("dotenv").config();

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

// Saves user input for shopping list
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
