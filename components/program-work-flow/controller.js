const BaseController = require("../base/controller");
const Service = require("./service");
const { responses } = require("../../libs/constants");

class Controller extends BaseController {
  constructor() {
    super();
    return this;
  }

  async create(req, res) {
    const order = await new Service().create(req, res);
    return order
      ? this.sendResponse({ req, res, type: responses.SUCCESS, data: order })
      : null;
  }

  async list(req, res) {
    const order = await new Service().findOrder(req, res);
    return order
      ? this.sendResponse({ req, res, type: responses.SUCCESS, data: order })
      : null;
  }
}

module.exports = Controller;
