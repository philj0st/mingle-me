var express = require('express'),
    app = express();

var session = require("express-session")({
  secret: "doom and destruction",
  resave: true,
  saveUninitialized: true
});

var Api = require('./Api');
var RecurseCenterUtils = require('./RecurseCenterUtils');

// HEROKU
// var config = {
//     clientID: '7a712978aeabada1cb22aae7fda0329308f1b933c851492d148baf2bdc288b4a',
//     clientSecret: '867407abdce6b384b84890276478dd9e21e7c740208ff05ed48882eda0eaac7a',
//     site: 'https://recurse.com',
//     redirect_uri: 'http://mingle-me.herokuapp.com/callback',
//     tokenPath: '/oauth/token',
//     authorizationPath: '/oauth/authorize'
// }

// LOCAL
var config = {
    clientID: "422ad34b0e726f82525f8038d693d2da88ab0eaabc73c89c9da62c9e68f0fc0e",
    clientSecret: "2152a747c1cce4d0d5e5b19ecd8532d7c56fe643ca480e0bef8ee87aaed20dc4",
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
    //find the ones which are active
    console.log('inside promise resolver', result);
    var batches = JSON.parse(result)
    var activeBatches = RecurseCenterUtils.filterActiveBatches(batches)
    console.log('batches filtered', activeBatches);
    res.json(activeBatches)
  },(reason) => {
    console.log('batches query rejected', reason);
    res.json(reason)
  })
})

app.get('/batches/:batch_id/people', function (req, res) {
  return Api.getPromise(`/batches/${req.params.batch_id}/people`, req.session.token.token.access_token).then((result) => {
    //find the ones which are active
    console.log('inside promise resolver', result)
    res.json(result)
  },(reason) => {
    console.log('batches/people query rejected', reason);
    res.json(reason)
  })
})


// #TODO find a way to refactor code reuse from active badges and chain promises
// app.get('/activeRecursers', function (req, res) {
//   //get batch list
//     var batchesPromise = Api.getPromise('/batches', req.session.token.token.access_token)
//     var activePeoplePromises = batchesPromise.then((result) => {
//     //find the ones which are active
//     console.log('batchesPromise', result);
//     var batches = JSON.parse(result)
//     var activeBatches = RecurseCenterUtils.filterActiveBatches(batches)
//     console.log('batches filtered', activeBatches);
//     //get array of people request promises
//     //GET /api/v1/batches/:batch_id/people
//     return peoplePromises = activeBatches.map((batch) => {Api.getPromise(`/batches/${batch.id}/people`, req.session.token.token.access_token)})
//     })
//   },(reason) => {
//     console.log('batches query rejected', reason);
//     res.json(reason)
//   })
//
//   Promise.all(batchesPromise.concat(activePeoplePromises)).then((results) => {
//     //flatten the array with reduction
//     //var activeRecursers = peopleArrays.reduce((p, c) => {p.concat(c)}, [])
//     console.log('recursers', results);
//     res.json(results)
// })

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
