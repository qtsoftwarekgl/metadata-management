const Controller = require("../base/controller");
const Schema = require("./schema");
const { responses } = require("../../libs/constants");

class Service extends Controller {
  constructor() {
    super();
    return this;
  }

  async create(req, res) {
    try {
      const order = new Schema({ ...req.body });
      return await order.save();
    } catch (error) {
      let responseType = responses.INTERNAL_SERVER_ERROR;
      responseType.MSG = error.message;

      this.sendResponse({ req, res, type: responseType });
    }
  }

  async findOrder(req, res) {
    try {
      const { fosaid, patientid, sampleid } = req.query;

      if (
        fosaid == undefined &&
        patientid == undefined &&
        sampleid == undefined
      ) {
        throw new Error(responses.BAD_REQUEST.MSG);
      }

      let whereQuery = {};
      if (fosaid) {
        whereQuery.fosaid = fosaid;
      }
      if (patientid) {
        whereQuery.patientid = patientid;
      }
      if (sampleid) {
        whereQuery.sampleid = sampleid;
      }

      const order = await Schema.findAll({ where: whereQuery });

      if (!order) {
        throw new Error(responses.RESOURCE_NOT_FOUND.MSG);
      }
      return order;
    } catch (error) {
      let responseType = responses.INTERNAL_SERVER_ERROR;
      responseType.MSG = error.message;

      if (error.message === responses.RESOURCE_NOT_FOUND.MSG) {
        responseType = responses.RESOURCE_NOT_FOUND;
      } else if (error.message === responses.BAD_REQUEST.MSG) {
        responseType = responses.BAD_REQUEST;
        responseType.MSG =
          "You must specify the FOSAID or PatientID or SampleID";
      }

      this.sendResponse({ req, res, type: responseType });
    }
  }
}

module.exports = Service;
