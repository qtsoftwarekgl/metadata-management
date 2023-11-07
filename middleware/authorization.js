const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Constant = require("../libs/constants");
const Controller = require("../components/base/controller");
const User = require("../components/user/schema");

const responses = Constant.responses;

class Authorization extends Controller {
  constructor() {
    super();
    return this;
  }

  async validateCredentials(req, res, next) {
    const { email, username, password } = req.headers;

    try {
      if ((!username && !email) || !password) {
        throw new Error("authorization required");
      }

      let query = email ? { email } : { username };
      const user = await User.findOne({ where: query });

      if (user) {
        bcrypt.compare(
          password,
          user.dataValues.password,
          function (err, result) {
            if (err) {
              res.json({success: responses.INTERNAL_SERVER_ERROR.CODE, message: 'Server dose not respond'});
            }

            if (!result) {
              res.json({success: responses.UNAUTHORIZED_REQUEST.CODE, message: 'wrong_password'});
            } else {
              next();
            }
          }
        );
      } else {
        throw new Error("user_not_found");
      }
    } catch (error) {
      return this.sendResponse({
        req,
        res,
        type: responses.INVALID_PAYLOAD,
        data: error.message,
      });
    }
  }

  async requireAuth(req, res, next) {
    const { authorization } = req.headers;
    console.log(authorization);

    try {
      if (authorization) {
        if (authorization.split(" ")[0] == "Bearer") {
          const token = authorization.replace("Bearer ", "");
          jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
            try {
              if (error) {
                throw new Error("wrong authorization token");
              }
              next();
            } catch (error) {
              return this.sendResponse({
                req,
                res,
                type: responses.UNAUTHORIZED_REQUEST,
                data: error.message,
              });
            }
          });
        } else if (authorization.split(" ")[0] == "Basic") {
          const base64Credentials = authorization.split(" ")[1];

          const credentials = Buffer.from(base64Credentials, "base64").toString(
            "ascii"
          );
          const [username, password] = credentials.split(":");

          const user = await User.findOne({ where: { username } });

          if (user) {
            const isMatch = await bcrypt.compare(
              password,
              user.dataValues.password
            );

            if (isMatch) {
              next();
            } else {
              throw new Error("wrong password");
            }
          } else {
            throw new Error("please specify valid credentials");
          }
        } else {
          throw new Error("please specify valid authorization type");
        }
      } else {
        throw new Error("please specify authorization token");
      }
    } catch (error) {
      return this.sendResponse({
        req,
        res,
        type: responses.UNAUTHORIZED_REQUEST,
        data: error.message,
      });
    }
  }
}

module.exports = Authorization;
