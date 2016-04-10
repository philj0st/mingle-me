var express = require('express'),
    app = express();

var session = require("express-session")({
  secret: "doom and destruction",
  resave: true,
  saveUninitialized: true
});

// HEROKU
var credentials = {
    clientID: '7a712978aeabada1cb22aae7fda0329308f1b933c851492d148baf2bdc288b4a',
    clientSecret: '867407abdce6b384b84890276478dd9e21e7c740208ff05ed48882eda0eaac7a',
    site: 'https://recurse.com',
    redirect_uri: 'http://mingle-me.herokuapp.com/callback',
    tokenPath: '/oauth/token',
    authorizationPath: '/oauth/authorize'
}

// LOCAL
// var credentials = {
//     clientID: "422ad34b0e726f82525f8038d693d2da88ab0eaabc73c89c9da62c9e68f0fc0e",
//     clientSecret: "2152a747c1cce4d0d5e5b19ecd8532d7c56fe643ca480e0bef8ee87aaed20dc4",
//     site: "https://recurse.com",
//     redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
//     tokenPath: "/oauth/token",
//     authorizationPath: "/oauth/authorize"
// }

// LOCAL
var oauth2 = require('simple-oauth2')(credentials);


var Api = require('./Api');

app.use(session)
// app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));


// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: credentials.redirect_uri
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: credentials.redirect_uri
  }, saveToken);

  function saveToken(error, result) {
    if (error) {
      console.log('Access Token Error', error.message);
      res.redirect('/auth')
    }else {
      req.session.token = oauth2.accessToken.create(result);
      console.log('session token',req.session.token);
      res.redirect('/')
    }
  }
});

//ROUTES
app.get('/', function (req, res) {
  if (req.session.token) {

    var batchCall = Api.getPromise('batches', req.session.token.token.access_token)
    var meCall = Api.getPromise('/people/me', req.session.token.token.access_token)

    //if all calls were successful
    Promise.all([batchCall, meCall]).then((values) => {
      console.log(values);
      res.send('<h1>hello' + values[0].first_name + '</h1>')
    }, (err) => {
      console.log(err);
    })

  }else {
    res.redirect('/auth')
  }
});

// Initial page redirecting to RC/login
app.get('/auth', function (req, res) {
  res.redirect(authorization_uri);
});

//mingleMe Api
app.get('/me', function (req, res) {
  Api.get('/people/me', req.session.token.token.access_token, function (err, result) {
    console.log(result);
    res.json(result)
  })
})

app.get('/mybatch', function (req, res) {
  Api.get('/people/me', req.session.token.token.access_token, function (err, result) {
    console.log(result);
    res.json(result)
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
