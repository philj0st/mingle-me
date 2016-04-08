var request = require('request');
var Api = function (path, token) {
  return {
    get: request('https://www.recurse.com/api/v1' + path + '?access_token=' + token,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            return body
        } else {return error}
      })
  }
}

module.export = Api
