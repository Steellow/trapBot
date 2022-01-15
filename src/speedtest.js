const FastSpeedtest = require("fast-speedtest-api");
require("dotenv").config();

////////////////////
// Fast speedtest //
////////////////////

const speedHistory = [];
const speedtest = new FastSpeedtest({
  token: process.env.SPEEDTEST_TOKEN, // required
  verbose: false, // default: false
  timeout: 10000, // default: 5000
  https: true, // default: true
  urlCount: 5, // default: 5
  bufferSize: 8, // default: 8
  unit: FastSpeedtest.UNITS.Mbps, // default: Bps
});

const howFast = async () => await speedtest.getSpeed();

module.exports = { howFast, speedHistory };
