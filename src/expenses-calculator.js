let state = {
  running: false,
  total: undefined,
  iikka: undefined,
  hanki: undefined,
};

const numberRegex = /[0-9()+\-*/.,]/;

const startCalculator = () => {
  resetState();
  state = { ...state, running: true };
};

const isRunning = () => state.running;

const showResults = (ctx) => {
  const totalShared = (state.total - state.iikka - state.hanki).toFixed(2);
  const totalIikka = (totalShared / 2 + state.iikka).toFixed(2);
  const totalHanki = (totalShared / 2 + state.hanki).toFixed(2);

  ctx.reply(`• Hanki: ${totalHanki}€\n• Iikka: ${totalIikka}€`);
};

const resetState = () =>
  (state = {
    running: false,
    total: undefined,
    iikka: undefined,
    hanki: undefined,
  });

const forward = (input, ctx) => {
  if (state.total == undefined) {
    state = { ...state, total: input };
    ctx.reply("Iikka's individual costs:");
  } else if (state.iikka == undefined) {
    ctx.reply("=" + input.toFixed(2));
    state = { ...state, iikka: input };

    ctx.reply("Hanki's individual costs:");
  } else {
    ctx.reply("=" + inputTotal.toFixed(2));
    state = { ...state, hanki: input };

    showResults(ctx);
    resetState();
  }
};

module.exports = { numberRegex, startCalculator, isRunning, forward };
