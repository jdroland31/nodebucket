/*
 * Title: Sprint 1 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/20/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

// The BaseResponse class provides a response object for requests.

class BaseResponse {
  constructor(httpCode,message,data,timestamp)
  {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toLocaleDateString('en-US')
  }

  toObject()
  {
    return {
      'httpCode' : this.httpCode,
      'message' : this.message,
      'data' : this.data,
      'timestamp' : this.timestamp
    }
  }
}

module.exports = BaseResponse;
