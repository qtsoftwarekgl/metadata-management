const axios = require("axios");
const { responses } = require("../libs/constants");
const Utils = require('../helpers/utils');
const _ = require("lodash");

const API = axios.create({
  headers: {
    'Content-Type': responses.HEADER.CONTENT_TYPE
  },
  timeout: responses.HEADER.TIMEOUT
});

API.interceptors.request.use(async (config) => {
if (await new Utils().getAuthToken() !== '') {
    _.merge(config.headers, {
        "Authorization": await new Utils().getAuthToken(),
    });
    }
  return config;
}, (err) => Promise.reject(err));

API.interceptors.response.use(
  response => {
    if (typeof response.data !== 'object') {
      return Promise.error({ message: responses.ERROR.INVALID_RESPONSE });
    }
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = API;