var express = require('express'),
    app = express();


app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

var oauth2 = require('simple-oauth2')({
  clientID: '7a712978aeabada1cb22aae7fda0329308f1b933c851492d148baf2bdc288b4a',
  clientSecret: '867407abdce6b384b84890276478dd9e21e7c740208ff05ed48882eda0eaac7a',
  site: 'https://recurse.com',
  tokenPath: '/oauth/token',
  authorizationPath: '/oauth/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://mingle-me.herokuapp.com/callback'
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3000/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
    console.log(token);
  }
});

app.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with RC</a>');
});

app.listen(3000);

console.log('Express server started on port 3000');
