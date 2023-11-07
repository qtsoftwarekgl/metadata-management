const Controller = require("../base/controller");
const Schema = require("./schema");
const acknowledgeSchema = require("./acknowledgeSchema");
const { responses } = require("../../libs/constants");

class Service extends Controller {
  constructor() {
    super();
    return this;
  }

  async create(req, res) {
    console.log(req.get("x-forwarded-for"));
    try {
      const data = {
        file_name: req.file.filename,
        version: req.body.version,
        release_note: req.body.release_note,
        status: 0,
        ip_address: req.get("x-forwarded-for")
      }
      const result= await this.find_version();
      if(result && result!=null){
        let version = parseFloat(result.dataValues.version) + 0.1;
        data.version = version.toFixed(1);
      }
      const obj = new Schema({ ...data });
      return await obj.save();
    } catch (error) {
      let responseType = responses.INTERNAL_SERVER_ERROR;
      responseType.MSG = error.message;

      this.sendResponse({ req, res, type: responseType });
    }
  }
  
  async find_version(){
    return await Schema.findOne({
      order: [ [ 'createdAt', 'DESC' ]]
    });
  }

  async findDump() {
    return await Schema.findOne({
      order: [ [ 'createdAt', 'DESC' ]],
    });
  }

  async fileDownload(req) {
    let query = req.query;
    console.log("query",query)
    let select={}
    select=query;
    select.status=1;
    console.log("select",select)
    return await Schema.findOne({
      where:select,
      order: [ [ 'createdAt', 'DESC' ]],
    });
  }

  async acknowledgement(data) {
    const result= await this.find_version();
    data.version = parseFloat(result.dataValues.version);
    const obj = new acknowledgeSchema({...data});
    return await obj.save();
  }

  async acknowledgementList(req, res) {
    const {query} = req;
    let limit = 20
    let page = 1
    let select={}
    if (query.limit) {
      limit = parseInt(query.limit)
    }
    if (query.page) {
      page = parseInt(query.page)
    }
    if (query.file_name) {
      select.file_name = query.file_name
    }
    if (query.focaid) {
      select.focaid = query.focaid
    }
    if (query.version) {
      select.version = query.version
    }
    if (query.facilityName) {
      select.facilityName = query.facilityName
    }
    let offset = 0
    if (page > 1) {
      offset = 0 + (page - 1) * limit
    }
    const count = await acknowledgeSchema.count();
    const results = await acknowledgeSchema.findAll({ where: select, limit, offset, order: [ [ 'createdAt', 'DESC' ]]});
    return {results, count}
  }

  async fileList(req, res) {
    const {query} = req;
    let limit = 20
    let page = 1
    let select = {}
    if (query.limit) {
      limit = parseInt(query.limit)
    }
    if (query.page) {
      page = parseInt(query.page)
    }
    if (query.file_name) {
      select.file_name = query.file_name
    }
    if (query.version) {
      select.version = query.version
    }
    if (query.release_note) {
      select.release_note = query.release_note
    }
    if (query.status) {
      select.status = query.status === "ACTIVE"? 1 : 0;
    }
    let offset = 0
    if (page > 1) {
      offset = 0 + (page - 1) * limit
    }
    const count = await Schema.count();
    const results = await Schema.findAll({ where: select, limit, offset, order: [ [ 'createdAt', 'DESC' ]]});
    return {results, count}
  }

  async update(req, res) {
    const {status} = req.body
    const {id} = req.params
    console.log("Lll", status, id)
    const result = await Schema.update({ status }, {
      where: {
        id: parseInt(id)
      }
    });
    return result
  }

  async latestVersion(req, res) {
    const {focaid} = req.query;
    const latestDump = await Schema.findOne({
      where: { status: 1},
      order: [ [ 'version', 'DESC' ]],
    })
    const acknowledge = await acknowledgeSchema.findOne({
      where: { focaid: focaid}, order: [ [ 'createdAt', 'DESC' ]]
    })
    if (latestDump && acknowledge) {
      let updateAvailable;
      if (Number(latestDump.version) === Number(acknowledge.version)) {
        updateAvailable = (latestDump.version === acknowledge.version) ? true : false;
      } else {
        updateAvailable = (Number(latestDump.version) > Number(acknowledge.version)) ? true : false;
      }
      return {
        releaseNote: latestDump.release_note,
        version: latestDump.version,
        updateAvailable: updateAvailable
      }
    } else if (latestDump) {
      return {
        releaseNote: latestDump.release_note,
        version: latestDump.version,
        updateAvailable: true
      }
    } else {
      return {}
    }
  }
}

module.exports = Service;
