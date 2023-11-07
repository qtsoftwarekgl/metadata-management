const joi = require("@hapi/joi");

class Validator {
  constructor() {
    return this;
  }

  static create = joi.object().keys({
    FOSAID: joi.string().required(),
    FacilityName: joi.string().required(),
    PatientID: joi.string().required(),
    TracnetID: joi.string().required(),
    PatientNames: joi.string().required(),
    SampleID: joi.string().required(),
    SampleBarcode: joi.string().required(),
    SpecimenType: joi.string().required(),
    TestRequested: joi.string().required(),
    Laboratory: joi.string().required(),
    CollectionDate: joi.date().required(),
    TestDate: joi.date().required(),
    Results: joi.string().required(),
  });

  static list = joi.object().keys();
}

module.exports = Validator;
