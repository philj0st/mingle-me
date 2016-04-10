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
  }
}
module.exports = Api
