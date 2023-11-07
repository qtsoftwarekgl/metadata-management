const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const Validator = require("../base/validator");
const requestValidator = require("./validator");

const controller = new Controller();
const validator = new Validator();

router
  .route("/signup")
  .post(
    validator.validateRequest.bind(
      new Validator().init(requestValidator.signup)
    ),
    controller.signup.bind(controller)
  );

router
  .route("/signin")
  .post(
    validator.validateRequest.bind(
      new Validator().init(requestValidator.signin)
    ),
    controller.signin.bind(controller)
  );

  router
  .route("/login")
  .post(
    // controller.verifyToken.bind(controller),
    validator.validateRequest.bind(
      new Validator().init(requestValidator.authenticate)
    ),
    controller.authenticate.bind(controller)
  );

  router
  .route("/email")
  .post(
    validator.validateRequest.bind(
      new Validator().init(requestValidator.isUniqueEmail)
    ),
    controller.uniqueEmailValidation.bind(controller)
  );

  router
  .route('/logout')
  .get(
    controller.jwtBlacklist.bind(controller))
  .post(
    controller.blackListToken.bind(controller)
  )

module.exports = router;
