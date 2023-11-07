const sequelize = require("sequelize");
const db = require("../../config/mysql");

const acknowledge = db.define("acknowledge", {
  file_name: {
    type: sequelize.STRING,
    trim: true
  },
  focaid: {
    type: sequelize.STRING,
    trim: true
  },
  version: {
    type: sequelize.STRING,
    trim: true,
  },
  facilityName: {
    type: sequelize.STRING,
    trim: true
  },

});
acknowledge.sync();

module.exports = acknowledge;