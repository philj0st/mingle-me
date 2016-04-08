var express = require('express'),
    app = express();

var session = require("express-session")({
  secret: "doom and destruction",
  resave: true,
  saveUninitialized: true
});

var oauth2 = require('simple-oauth2')({
  clientID: '7a712978aeabada1cb22aae7fda0329308f1b933c851492d148baf2bdc288b4a',
  clientSecret: '867407abdce6b384b84890276478dd9e21e7c740208ff05ed48882eda0eaac7a',
  site: 'https://recurse.com',
  tokenPath: '/oauth/token',
  authorizationPath: '/oauth/authorize'
});

var Api = require('./Api');

app.use(session)
app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));


// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://mingle-me.herokuapp.com/callback'
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://mingle-me.herokuapp.com/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) {
      console.log('Access Token Error', error.message);
      res.redirect('/auth')
     }
    req.session.token = oauth2.accessToken.create(result);
    console.log('session token',req.session.token);
  }
});

//ROUTES
app.get('/', function (req, res) {
  if (req.session.token) {
    res.send(Api.get('/people/me', req.session.token))
  }else {
    res.redirect('/auth')
  }
});

// Initial page redirecting to RC/login
app.get('/auth', function (req, res) {
  res.redirect(authorization_uri);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
