const express = require("express");
const fs = require("fs");
const router = express.Router();
const Controller = require("./base/controller");
const Constant = require("../libs/constants");
const responses = Constant.responses;

router.get("/", (req, res) =>
  new Controller().sendResponse({
    req,
    res,
    type: responses.SUCCESS,
    data: "Lab_order_management_apis is running...",
  })
);

fs.readdir(__dirname, function (err, components) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  console.log("llll", process.env.BASEPATH)
  components.forEach(function (component) {
    try {
      if (fs.existsSync(`${__dirname}/${component}/router.js`)) {
        router.use(
          `${process.env.BASEPATH}/${component}`.toLowerCase(),
          require(`./${component}/router`)
        );
      }
    } catch (e) {
      console.log("error", e);
    }
  });
});

module.exports = router;
