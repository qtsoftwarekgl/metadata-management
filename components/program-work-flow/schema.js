const sequelize = require("sequelize");
const db = require("../../config/mysql");

const Order = db.define("program_workflow", {
  program_id: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  concept_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  creator: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  changed_by: {
    type: sequelize.INTEGER,
    allowNull: true
  },
  date_changed: {
    type: sequelize.DATETIME,
    defaultValue: sequelize.NOW
  },
  retired: {
    type: sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  name: {
    type: sequelize.STRING,
    trim: true,
    allowNull: false,
  },
  description: {
    type: sequelize.STRING,
    trim: true,
    allowNull: true
  },
  uuid: {
    type: sequelize.CHAR,
    trim: true,
    allowNull: false
  },
  outcomes_concept_id: {
    type: sequelize.INTEGER,
    allowNull: true
  },
  date_created: {
    type: sequelize.DATETIME,
    defaultValue: sequelize.NOW
  }
});

module.exports = Order;
