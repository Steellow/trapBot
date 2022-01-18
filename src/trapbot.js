const { Telegraf } = require("telegraf");
const { howFast, speedHistory } = require("./speedtest.js");
const shoppingList = require("./shoppinglist");
const expensesCalc = require("./expenses-calculator");
const stringMath = require("string-math");
require("dotenv").config();

///////////////
// Bot setup //
///////////////

const bot = new Telegraf(process.env.BOT_TOKEN);

///////////////
// Speedtest //
///////////////

bot.command("/speed", async (ctx) => {
  const speed = await howFast();
  speedHistory.push(speed);
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

/////////////////////////
// Expenses calculator //
/////////////////////////

// Using async func since it has 2 ctx.replies
// Without await they might run in wrong order
bot.hears("/calc", async (ctx) => {
  expensesCalc.startCalculator();
  await ctx.reply("Hello, please enter the following data 🤑");
  await ctx.reply("Total costs:");
});

// More related stuff at 'input functions'

///////////////////
// Shopping list //
///////////////////

bot.hears(["/list", "/print"], (ctx) => {
  let printableList = "";
  shoppingList.getList().forEach((item, index) => {
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
  shoppingList.clear();
  ctx.reply("The list has been cleared.");
});

// Remove individual items by number
bot.hears("/remove", (ctx) => ctx.reply("Specify which item to remove"));
bot.hears(/\/remove (.+)/, (ctx) => {
  const index = Number(ctx.match[1]) - 1;

  if (shoppingList.removeItem(index)) {
    return;
  } else {
    ctx.reply("Invalid number");
  }
});

// More related stuff at 'input functions'

/////////////////////
// Input functions //
/////////////////////

//! Input listeners need to be last
//! functions, otherwise they block
//! other bot listener functions!

// Expenses calculator input listener
bot.hears(expensesCalc.numberRegex, async (ctx) => {
  if (!expensesCalc.isRunning()) {
    await ctx.reply("Please start the calculator with /calc");
    return;
  }

  try {
    const input = ctx.match.input.replace(",", ".");
    inputTotal = stringMath(input);
  } catch (err) {
    console.log(err);
    await ctx.reply("Invalid number/operation🔺 ");
    return;
  }

  expensesCalc.forward(inputTotal, ctx);
});

// Shopping list input listener
// Saves user input for shopping list
bot.on("text", (ctx) => {
  const text = ctx.update.message.text;
  if (text[0] === "/") return;
  shoppingList.addItem(text);
});

/////////////////////////////

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch();
