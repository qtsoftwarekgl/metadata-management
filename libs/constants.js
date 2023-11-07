class Constant {
  static responses = {
    SUCCESS: { CODE: 200, MSG: "Success" },
    HEADER: {
      AUTHORIZATION: 'Authorization',
      CONTENT_TYPE: 'application/json',
      MULTIPART_CONTENT_TYPE: 'multipart/form-data',
      TIMEOUT: 120000,
      TOKEN: 'x-auth-token',
      CONTENT_TYPE: 'application/json',
      REFRESH_TOKEN: '/refreshtoken'
    },
    ERROR: {
      MSG: 'error',
      INVALID_RESPONSE: 'INVALID_RESPONSE',
      CODE: 500,
    },
    BAD_REQUEST: { CODE: 400, MSG: "Bad Request" },
    RESOURCE_ALREADY_EXISTS: { CODE: 409, MSG: "Resource Already Exists" },
    MOVED_PERMANENTLY: { CODE: 301, MSG: "Moved Permanently" },
    UNAUTHORIZED_REQUEST: { CODE: 401, MSG: "Unauthorized Request" },
    FORBIDDEN_REQUEST: { CODE: 403, MSG: "Forbidden Request" },
    RESOURCE_NOT_FOUND: { CODE: 404, MSG: "Resource Not Found" },
    INVALID_PAYLOAD: { CODE: 422, MSG: "Invalid Input Payload" },
    INTERNAL_SERVER_ERROR: { CODE: 500, MSG: "Internal Server Error" },
    SESSION: {
      EXPIRED: {
        CODE: 310
      },
      MESSAGE: {
        message: 'Logged out successfully'
      }
    },
    MSG: {
      HAS_RECORD: 'record(s) found'
    },  
    SESSION_EXPIRED: 'session expired',
  };
}
module.exports = Constant;
