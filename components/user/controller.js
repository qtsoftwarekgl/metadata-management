const _ = require('lodash')
const jwt = require('jsonwebtoken')
const BaseController = require("../base/controller");
const Service = require("./service");
const { responses } = require("../../libs/constants");
const TokenGenerator = require('../../helpers/token_generator')
const requestValidator = require('./validator')
const responseValidator = require('./responseValidator')

const tokenGenerator = new TokenGenerator(
  process.env.JWT_SECRET,
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN
  }
)
class Controller extends BaseController {
  constructor() {
    super();
    return this;
  }

  async signup(req, res) {
    const user = await new Service().signup(req, res);
    return user
      ? this.sendResponse({ req, res, type: responses.SUCCESS, data: user })
      : null;
  }
  async signin(req, res) {
    const user = await new Service().signin(req, res);
    return user
      ? this.sendResponse({ req, res, type: responses.SUCCESS, data: user })
      : null;
  }

  static hasValidHeader (req) {
    const reqHeader = req.headers
    // console.log("reqHeader",reqHeader)
    return (
      _.has(reqHeader, 'content-type') &&
      _.has(reqHeader, responses.HEADER.TOKEN) &&
      (reqHeader['content-type'].indexOf('application/json') !== -1 ||
        reqHeader['content-type'].indexOf('multipart/form-data') !== -1)
    )
  }
  static verifyJWTToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
          return reject(err)
        }
        return resolve(decoded)
      })
    })
  }
  static async hasValidToken(req){
    const validHeader = Controller.hasValidHeader(req)
    // console.log("validHeader",validHeader)
    if (validHeader) {
      const token = req.headers[responses.HEADER.TOKEN]
      console.log("token",token)
      const validReq = requestValidator.verify.validate(token)
      // console.log("validReq",validReq)
      if (validReq.value) {
        const decodedToken = await Controller.verifyJWTToken(validReq.value)
        // console.log("decodedToken",decodedToken)
        if (_.has(decodedToken, 'email')) {
          return { token, decodedToken }
        } else {
          return 'server_error.bad_request'
        }
      } else if (_.has(validReq, 'error') && _.has(validReq.error, 'message')) {
        return validReq.error.message
      }
    } else {
      return 'server_error.bad_request'
    }
    return null
  }
  async verifyToken (req, res, next){
    const validToken =  await Controller.hasValidToken(req).catch(err=>{
    const errMsg = { message: err.message }
    // console.log("errMsg",errMsg)
    const code = {}
    if (err.message === "session_expired") {
      errMsg.message = 'server_error.session_expired'
      code.errorCode = responses.SESSION.EXPIRED.CODE
    } else if (err.message === 'invalid signature') {
      errMsg.message = 'server_error.invalid_token'
    }
    this.sendResponse({ req, res, type: responses.ERROR, errMsg, code})    
    })

    // console.log("validToken",validToken)

    if (!_.isUndefined(validToken) && _.has(validToken, 'token')) {
      const { token, decodedToken } = validToken
      if (req.url === responses.HEADER.REFRESH_TOKEN) {
        await this.generateRefreshToken(req, res, token, decodedToken).catch(
          err => {
            this.sendResponse({ req, res, type: responses.ERROR, err})    
          }
        )
      } else {
        req.userData = decodedToken
        req.params = decodedToken
        next()
      }
    } else if (_.isString(validToken)) {
      const code = {}
      if (validToken === responses.MSG.SESSION_EXPIRED) {
        code.errorCode = responses.SESSION.EXPIRED.CODE
      }
      this.sendResponse({ req, res, type: responses.ERROR, data: {validToken,code} })    
    }
  }  
  
  static generateToken (payload) {
    if (typeof payload !== 'object' || payload.constructor !== Object) {
      throw new Error('Payload should be of type object')
    }
    return tokenGenerator.sign(payload, { jwtid: process.env.JWT_SECRET })
  }

  static getPayload (data) {
    const { fname, lname, phone, country, location, username,email } = data.user
    return {
      fname:fname,
      lname:lname,
      phone:phone,
      country:country,
      location:location,
      username:username,
      email: email || '',
    }
  }

  async authenticateSuccessAction (req, res, resData) {
    // console.log("resData",resData)
    const payload = Controller.getPayload(resData)
    const token = Controller.generateToken(payload)
    const decodedToken = jwt.decode(token, { json: true })
    const resToValidate = { token, expires_in: decodedToken.exp }
    // console.log("resToValidate",resToValidate)
    const validResponse = await responseValidator.create.validate(resToValidate)
    // console.log("validResponse",validResponse)
    if (!_.isUndefined(validResponse) && _.has(validResponse.value, 'token')) {
      // await new Service().update({ _id: resData._id }, { lastLoggedAt: new Date() })
      var data={
        token:validResponse.value.token,
        expires_in:validResponse.value.expires_in,
        payload,
        status:'ok'
      }
      return this.sendResponse({ req, res, type: responses.SUCCESS, data})
    } else if (!(validResponse instanceof Error)) {
      this.sendResponse({ req, res, type: responses.SUCCESS, data: { message: 'server_error.invalid_token', status:'error' } })
    }
  }

  async authenticate (req, res) {
    // console.log("first")
    const userInfo = await new Service().authenticate(req)
    // console.log("userInfo",userInfo)
    if (!_.isUndefined(userInfo)) {
        this.authenticateSuccessAction(req, res, userInfo, true)
    } else {
      this.sendResponse({ req, res, type: responses.SUCCESS, data: { message: 'server_error.invalid_username_or_password',status:'error' }})
    }
  }

  async uniqueEmailValidation (req, res) {
    const result = await new Service().isEmailAlreadyExist(req)
    // console.log("result",result)
    if (!_.isUndefined(result)) {
      this.sendResponse({ req, res, type: responses.SUCCESS, data: { message: 'server_error.email_already_exists',status:'ok' }})
    } else {
      this.sendResponse({req, res, type: responses.SUCCESS, data:{ message: 'server_error.email_doesn\'t_exist.',status:'error'}})
    }
  }

  async jwtBlacklist (req, res) {
    const token = req.headers[responses.HEADER.TOKEN]
    if (!_.isUndefined(token) && token) {
      this.sendResponse({req, res, type: responses.ERROR})
    } else {
      this.sendResponse({req, res, type: responses.SUCCESS})
    }
  }

  async blackListToken (req, res) {
    const token = req.headers[responses.HEADER.TOKEN]
    if(token){
      this.sendResponse({req, res, type: responses.SUCCESS, data: { message: 'server_success.logged_out_successfully' }})
    }
  }
}

module.exports = Controller;
