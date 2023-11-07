const sequelize = require("sequelize");
const db = require("../../config/mysql");

const dump = db.define("sql_dump", {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  file_name: {
    type: sequelize.STRING,
    trim: true,
    allowNull: false
  },
  version: {
    type: sequelize.STRING,
    trim: true,
    allowNull: false
  },
  release_note: {
    type: sequelize.STRING,
    trim: true
  },
  status: {
    type: sequelize.INTEGER
  },
  ip_address: {
    type: sequelize.STRING,
    trim: true
  }
});

module.exports = dump;