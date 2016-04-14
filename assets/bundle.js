var time = 10
//var ctx = document.getElementById("canvas").getContext("2d")

function getCurrentBatches() {
  return fetch('/batches/active', {
  	method: 'get',
    credentials: 'same-origin'
  })
}

function getPeopleFromBatch(batch) {
  return fetch(`/batches/${batch.id}/people`, {
    method: 'get',
    credentials: 'same-origin'
  })
}

getCurrentBatches().then((batchesResponse) => {
  console.log('batch responses received', batchesResponse);
  return batchesResponse.json()
}).then((batches) => {
  console.log('batches parsed', batches);
  spawnNotification(`batches loaded ${batches[0].name} and ${batches[1].name}`,'loading_spinner.gif','Initializr')
  return Promise.all(batches.map(getPeopleFromBatch))
}).then((peopleResponses) => {
  console.log('people responses received', peopleResponses);
  console.log('is an array', Array.isArray(peopleResponses));
  //map does not work for some strange reason
  // return Promise.all(peopleResponses.map((peopleResponse) => {peopleResponse.json()}))
  //can call foreach though
  var arr = []
  peopleResponses.forEach(r => arr.push(r.json()))
  return Promise.all(arr)
}).then((people) => {
  //parse both arrays in people then reduce them into a flattened new one
  var parsed = people.map(JSON.parse)
  var flattened = parsed.reduce((p,c) => p.concat(c), [])
  spawnNotification(`${flattened.length} active Recurser Data loaded`,'loading_spinner.gif','Initializr')
  preLoadImages(flattened)
})

function preLoadImages(recurser) {
  //promise.all returns a new promise that gets resolved when all the promises in the array are resolved
  Promise.all(recurser.map((r) => new Promise(function(resolve, reject) {
    var img = new Image()
    img.src = r.image
    img.addEventListener('load',function (event) {
      //replace url with actual image reference
      r.image = img
      resolve(r)
    })
  }))).then((recurser) => {
    //recursers who have their image loaded
    console.log(recurser);
    spawnNotification(`all ${recurser.length} images preLoaded`,'loading_spinner.gif','Initializr')
    initWheel(recurser)
  })
}

//init canvas
function initWheel(recurser) {
  var canvas = document.createElement('canvas');
  canvas.id = "canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";
  document.body.appendChild(canvas);

  //draw background
  var ctx = document.getElementById('canvas').getContext("2d")
  var xPos = 0, yPos =0
  for (var i = 0; i < recurser.length; i++) {
    if (xPos > window.innerWidth) {
      xPos = 0
      yPos += 150
      ctx.drawImage(recurser[i].image, xPos, yPos)
      xPos += 150
    }else {
      ctx.drawImage(recurser[i].image, xPos, yPos)
      xPos += 150
    }
  }

  // debugger
  //
  // var theWheel = new Winwheel({
  //   'numSegments' : recurser.length,
  //   'fillStyle'   : '#e7706f',
  //   'lineWidth'   : 1
  // });
}

function spinWheel() {
  if (time < 1000) {
    time = time + (time/7)
    console.log(time)

    //change picture
    // var {image} = randomArrayItem(people)
    // document.getElementById('recurser-image').src = image
    setTimeout(spinWheel, time)
  }
}

function randomArrayItem(array) {
  return item = array[Math.floor(Math.random()*array.length)];
}

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}
Notification.requestPermission().then(function(result) {
  console.log(result);
});
function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
      body: theBody,
      icon: theIcon
  }
  var n = new Notification(theTitle,options);
  setTimeout(n.close.bind(n), 4000);
}
