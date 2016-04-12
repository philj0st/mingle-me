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
// app.use(express.static('public'));

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
  if (req.session.token) {
    res.send('logged in')
    // console.log('logged in successful');
    // var meQuery = Api.getPromise('/people/me', req.session.token.token.access_token)
    // var batchQuery = Api.getPromise('/batches', req.session.token.token.access_token)
    //
    // //chain the call to get all people from current batches
    // batchQuery.then((result) => {
    //   //if the /batches call was successful, find out which batches are active a and then query their people
    //   var batchMemberPromises = []
    //   //push every active recurser
    //   RecurseCenterUtils.getActiveBatches(result).forEach(function (activeBatch) {
    //     console.log('active batch found: ',activeBatch);
    //     batchMemberPromises.push(Api.getPromise('batches/' + activeBatch.id + '/people', req.session.token.token.access_token))
    //   })
    //
    //   var activeRecursers = []
    //   //if all people queries for current batches have resolved
    //   Promise.all(batchMemberPromises).then((result) => {
    //     result.forEach(function (people) {
    //       activeRecursers.concat(people)
    //       res.send(JSON.stringify(activeRecursers))
    //     })
    //   })
    //
    //
    // },(reason) => {
    //   //rejected batchQuery
    //   console.log('batchQuery rejected', reason);
    // })
    //if all calls were successful
    //#TODO will this go down the batchQuery's chain of promises
    // Promise.all([batchQuery, meQuery]).then((values) => {
    //   console.log('all promises resolved', values);
    //   res.send('<h1>hello' + values[0].first_name + '</h1>')
    // }, (err) => {
    //   console.log(err);
    // })
  //redirect to auth if there is no token saved in the session
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

app.get('/activeBatches', function (req, res) {
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

//find a way to refactor code reuse from active badges
app.get('/activeRecursers', function (req, res) {
  //get batch list
  return Api.getPromise('/batches', req.session.token.token.access_token).then((result) => {
    //find the ones which are active
    console.log('inside promise resolver', result);
    var batches = JSON.parse(result)
    var activeBatches = RecurseCenterUtils.filterActiveBatches(batches)
    console.log('batches filtered', activeBatches);
    //get array of people request promises
    //GET /api/v1/batches/:batch_id/people
    peoplePromises = activeBatches.map((batch) => {Api.getPromise(`/batches/${batch.id}/people`, req.session.token.token.access_token)})
  },(reason) => {
    console.log('batches query rejected', reason);
    res.json(reason)
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
