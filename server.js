var express = require('express'),
    app = express();

var session = require("express-session")({
  secret: "doom and destruction",
  resave: true,
  saveUninitialized: true
});

var Api = require('./Api');
var RecurseCenterUtils = require('./RecurseCenterUtils');

// // HEROKU
// var config = {
//     clientID: process.env.MM_HEROKU_CLIENT_ID,
//     clientSecret: process.env.MM_HEROKU_CLIENT_SECRET,
//     site: 'https://recurse.com',
//     redirect_uri: 'http://mingle-me.herokuapp.com/callback',
//     tokenPath: '/oauth/token',
//     authorizationPath: '/oauth/authorize'
// }

//LOCAL
var config = {
    clientID: process.env.MM_LOCAL_CLIENT_ID,
    clientSecret: process.env.MM_LOCAL_CLIENT_SECRET,
    site: 'https://recurse.com',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    tokenPath: "/oauth/token",
    authorizationPath: "/oauth/authorize"
}

var oauth2 = require('simple-oauth2')(config);

app.use(session)
app.use(express.static('assets'));

app.set('port', (process.env.PORT || 5000));

//OAuth2 authorization
// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: config.redirect_uri
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: config.redirect_uri
  }, saveToken);

  function saveToken(error, result) {
    if (error) {
      res.redirect('/auth')
    }else {
      req.session.token = oauth2.accessToken.create(result);
      res.redirect('/')
    }
  }
});

// Initial page redirecting to RC/login
app.get('/auth', function (req, res) {
  res.redirect(authorization_uri);
});

//ROUTES
app.get('/', function (req, res) {
  //send index.html if user is logged in
  if (req.session.token) {
//  if (true) {
    res.sendFile(__dirname + '/public/index.html');
  }else {
    res.redirect('/auth')
  }
});


//mingleMe Api
app.get('/me', function (req, res) {
  Api.get('/people/me', req.session.token.token.access_token, function (err, result) {
    console.log('fetched me', result);
    res.json(result)
  })
})

app.get('/batches/active', function (req, res) {
  //get batch list
  return Api.getPromise('/batches', req.session.token.token.access_token).then((result) => {
    var batches = JSON.parse(result)
    //filter the ones which are active
    var activeBatches = RecurseCenterUtils.filterActiveBatches(batches)
    res.json(activeBatches)
  },(reason) => {
    res.json(reason)
  })
})

//#TODO: test this
app.get('/batches/active/people', function (req, res) {
  console.log('hit endpoint', req.originalUrl);
  //get batch list
  Api.getPromise('/batches', req.session.token.token.access_token).then((result) => {
    console.log('batches promises created', result);
    var batches = JSON.parse(result)
    //filter the ones which are active
    var activeBatches = RecurseCenterUtils.filterActiveBatches(batches)
    console.log('active batches filtered', activeBatches);
    //doesnt trigger .then .. maybe doesnt get resolved??
    return Promise.all(activeBatches.map(batch => Api.getPromise(`/batches/${batch.batch_id}/people`, req.session.token.token.access_token)))
  },(reason) => {
    console.error('cannot query batches');
  }).then(activePeople => {
    console.log('batches active people',activePeople);
    return activePeople
  })
})

app.get('/batches/:batch_id/people', function (req, res) {
  return Api.getPromise(`/batches/${req.params.batch_id}/people`, req.session.token.token.access_token).then((result) => {
    res.json(result)
  },(reason) => {
    res.json(reason)
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
