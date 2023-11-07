const moment = require("moment");
const axios = require("axios");
const { responses } = require("../libs/constants");

class Utils {
  constructor() {
    return this;
  }

  rightNow() {
    return moment().format("YYYY-MM-DD :: hh:mm:ss");
  }

  async getAuthToken() {
    const res = await axios.post(`${responses.VLSM_URL}/user/login.php`, {
      userName: process.env.VLSM_USERNAME,
      password: process.env.VLSM_PASSWORD,
      apiVersion: process.env.VLSM_API_VERSION
    })
    if (res.status) {
      return res.data.data.api_token
    } else {
      return ''
    }
  }
}

module.exports = Utils;
