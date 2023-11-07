const joi = require("@hapi/joi");

class Validator {
  constructor() {
    return this;
  }

  static signup = joi.object().keys({
    fname: joi.string().required(),
    lname: joi.string().required(),
    phone: joi.string().required(),
    country: joi.string(),
    location: joi.string(),
    username: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });
  static signin = joi.object().keys({
    username: joi.string(),
    email: joi.string(),
    password: joi.string().required(),
  });
  static authenticate = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required()
  });
  static verify = joi.string().required();
  static isUniqueEmail = joi.object().keys({
    email: joi.string().required(),    
  })
}

module.exports = Validator;
