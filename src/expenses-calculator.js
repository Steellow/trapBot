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

const showResults = async (ctx) => {
  const totalShared = (state.total - state.iikka - state.hanki).toFixed(2);
  const totalIikka = (totalShared / 2 + state.iikka).toFixed(2);
  const totalHanki = (totalShared / 2 + state.hanki).toFixed(2);

  await ctx.reply(
    `•Total: ${state.total}€\n• Hanki: ${totalHanki}€\n• Iikka: ${totalIikka}€`
  );
};

const resetState = () =>
  (state = {
    running: false,
    total: undefined,
    iikka: undefined,
    hanki: undefined,
  });

const forward = async (input, ctx) => {
  if (state.total == undefined) {
    state = { ...state, total: input };
    await ctx.reply("Iikka's individual costs:");
  } else if (state.iikka == undefined) {
    await ctx.reply("=" + input.toFixed(2));
    state = { ...state, iikka: input };

    await ctx.reply("Hanki's individual costs:");
  } else {
    await ctx.reply("=" + inputTotal.toFixed(2));
    state = { ...state, hanki: input };

    showResults(ctx);
    resetState();
  }
};

module.exports = { numberRegex, startCalculator, isRunning, forward };
