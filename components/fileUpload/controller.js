const BaseController = require("../base/controller");
const Service = require("./service");
const { responses } = require("../../libs/constants");

class Controller extends BaseController {
  constructor() {
    super();
    return this;
  }

  async upload(req, res) {
    const response = await new Service().create(req, res);
    console.log(response);
    return response
      ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response })
      : null;
  }

  async findDump(req, res) {
    try {
      const file = await new Service().findDump();
      console.log("fileName", file.dataValues.file_name)
      const dump = `./uploads/${file.dataValues.file_name}`;
      res.download(dump);
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async fileDownload(req, res) {
    try {
      const file = await new Service().fileDownload(req);
      console.log("fileName", file.dataValues.file_name)
      const dump = `./uploads/${file.dataValues.file_name}`;
      res.download(dump);
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async acknowledgement(req, res) {
    try {
      const response = await new Service().acknowledgement({...req.body});
      console.log("response",response)
      return response
        ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response })
        : null;
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async acknowledgementList(req, res) {
    try {
      const response = await new Service().acknowledgementList(req, res);
      return response
        ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response})
        : null;
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async fileList(req, res) {
    try {
      const response = await new Service().fileList(req, res);
      return response
        ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response})
        : null;
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async update(req, res) {
    try {
      const response = await new Service().update(req, res);
      return response
        ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response})
        : null;
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }

  async latestVersion(req, res) {
    try {
      const response = await new Service().latestVersion(req, res);
      return response
        ? this.sendResponse({ req, res, type: responses.SUCCESS, data: response})
        : null;
    } catch (err) {
      this.sendResponse({ req, res, type: responses.ERROR, data: {} })
    }
  }
}

module.exports = Controller;