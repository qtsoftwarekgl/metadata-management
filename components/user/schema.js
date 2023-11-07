const sequelize = require("sequelize");
const db = require("../../config/mysql");

const User = db.define("users", {
  fname: {
    type: sequelize.STRING,
    trim: true,
  },
  lname: {
    type: sequelize.STRING,
    trim: true,
  },
  phone: {
    type: sequelize.STRING,
    trim: true,
  },
  country: {
    type: sequelize.STRING,
    trim: true,
    defaultValue: "RWANDA",
  },
  location: {
    type: sequelize.STRING,
    trim: true,
  },
  username: {
    type: sequelize.STRING,
    trim: true,
    unique: true,
  },
  email: {
    type: sequelize.STRING,
    trim: true,
    primaryKey: true,
  },
  password: {
    type: sequelize.STRING,
    trim: true,
  },
}, {
  timestamps: false
});

module.exports = User;
