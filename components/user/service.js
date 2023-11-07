const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Controller = require("../base/controller");
const Schema = require("./schema");
const { responses } = require("../../libs/constants");

class Service extends Controller {
  constructor() {
    super();
    return this;
  }

  async signup(req, res) {
    try {
      const user = new Schema({ ...req.body });

      user.password = await bcrypt.hash(user.password, 8);
      await user.save();
      return { message: "account created successfull" };
    } catch (error) {
      let responseType = responses.INTERNAL_SERVER_ERROR;
      responseType.MSG = "username_or_email already exist";

      this.sendResponse({ req, res, type: responseType });
    }
  }

  async signin(req, res) {
    const { email, username, password } = req.body;

    try {
      if (!email && !username) {
        throw new Error("please enter email or username");
      }

      if (!password) {
        throw new Error("please enter password");
      }

      let query = email ? { email } : { username };
      const user = await Schema.findOne({ where: query });

      if (user) {
        const isMatch = await bcrypt.compare(
          password,
          user.dataValues.password
        );

        if (isMatch) {
          return { token: jwt.sign({ email }, process.env.JWT_SECRET) };
        } else {
          throw new Error("wrong password");
        }
      } else {
        throw new Error("user_not_found");
      }
    } catch (error) {
      this.sendResponse({
        req,
        res,
        type: responses.UNAUTHORIZED_REQUEST,
        data: error.message,
      });
    }
  }

  async authenticate(req) {
    const { email, password } = req.body;
    let query = { email }
    // console.log("query", query)
    try {
      const user = await Schema.findOne({ where: query });
      // console.log("user", user)
      if (user) {
        const isMatch = await bcrypt.compare(
          password,
          user.dataValues.password
        );

        if (isMatch) {
          return { token: jwt.sign({ email }, process.env.JWT_SECRET), user };
        } else {
          throw new Error("wrong password");
        }
      } else {
        throw new Error("user_not_found");
      }
    } catch (error) {
      return ;
    }
  }

  async isEmailAlreadyExist(req) {
    const { email } = req.body;
    let query = { email }
    try {
      const result = await Schema.findOne({ where: query });
      // console.log("result", result)
      if (result !== null && result.dataValues) {
        return result;
      } else {
        throw new Error();
      }
    } catch (error) {
      return ;
    }
  }
}

module.exports = Service;
