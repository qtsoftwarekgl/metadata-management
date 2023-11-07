const joi = require('@hapi/joi')

const create = joi.object().keys({
  token: joi.string().required(),
  expires_in: joi.number().required(),
  userData: joi.object().keys()
})

const verify = joi.object().keys({
  token: joi.string().required(),
  expires_in: joi.number().required()
})

module.exports = {
  create,
  verify
}
