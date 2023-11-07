const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const Validator = require("../base/validator");
const requestValidator = require("./validator");
const Authorization = require("../../middleware/authorization");
const controller = new Controller();
const validator = new Validator();

router
  .route("/create")
  .post(
    validator.validateRequest.bind(
      new Validator().init(requestValidator.create)
    ),
    controller.create.bind(controller)
  );

router
  .route("/list")
  .post(
    validator.validateRequest.bind(new Validator().init(requestValidator.list)),
    controller.list.bind(controller)
  );

module.exports = router;
