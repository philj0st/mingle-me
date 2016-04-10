var request = require('request');
var Api = {
  get: function (path, token, callback) {
    request('https://www.recurse.com/api/v1' + path + '?access_token=' + token,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(null, body)
            return body
        } else {callback('api call was not successful', null)}
      })
  },
  getPromise: function (path, token) {
    return new Promise(function(resolve, reject) {
      request('https://www.recurse.com/api/v1' + path + '?access_token=' + token,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //resolve promise when request was successful
          resolve(body)
        } else {
          reject(error)
        }
      })
    })
  }
}
module.exports = Api
