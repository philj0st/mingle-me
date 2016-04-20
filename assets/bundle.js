var MingleMe = React.createClass({
  render: function() {
    return (
      <div>
        <Profile />
      </div>
    )
  }
});

var Profile = React.createClass({
  renderProfileImage: function () {
    //set profile picture
    this.refs.avatarCanvas.getContext("2d").drawImage(this.state.currentProfile.image, 0, 0)
  },
  mingle: function () {
    this.setState({currentProfile: randomArrayItem(this.state.profiles)})
  },
  getInitialState: function() {
    let img = new Image ()
    img.src = 'default_large.png'
    return {
      currentProfile: {
        first_name: "John",
        last_name: "Doe",
        interests: "Python, Django, Git, Mercurial, Machine learning, JavaScript, HTML/CSS, microservices, Programming languages",
        image: img
      },
      profiles: []
    }
  },
  componentDidUpdate: function () {
    this.renderProfileImage()
    console.log('updated');
  },
  componentDidMount: function () {
    getCurrentBatches().then((batchesResponse) => {
      return batchesResponse.json()
    }).then((batches) => {
      spawnNotification(`batches loaded ${batches[0].name} and ${batches[1].name}`,'loading_spinner.gif','Initializr')
      return Promise.all(batches.map(getPeopleFromBatch))
    }).then((peopleResponses) => {
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
        spawnNotification(`all ${recurser.length} images preLoaded`,'loading_spinner.gif','Initializr')
        //recursers who have their image loaded
        bindProfiles(recurser)
      })
    }
    var bindProfiles = (profiles) => this.setState({profiles})
  },
  render: function() {
    console.log('curr prof', this.state.currentProfile);
    let {image, first_name, last_name, interests} = this.state.currentProfile
    // console.log('rendering with ', this.props.profile);
    if (interests) {
      interests = interests.split(',').map(i => {
        return <kbd>{i}</kbd>
      })
    }else {
      interests = <kbd>no interests :(</kbd>
    }
    return (
      <div className="profile">
        <canvas height="150" width="150" ref="avatarCanvas" />
        <h3>{`${first_name} ${last_name}`}</h3>
        <div className="interests">
          {interests}
        </div>
        <a
          className="btn-mingle btn-lg btn"
          onClick={this.mingle}
        >mingle!</a>
      </div>
    )
  }
})

ReactDOM.render(
  <MingleMe />,
  document.getElementById('app')
);

/*
* Utilities
*/

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



// //init canvas
// function initWheel(recurser) {
//   var canvas = document.createElement('canvas');
//   canvas.id = "canvas";
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   canvas.style.zIndex = 8;
//   canvas.style.position = "absolute";
//   canvas.style.border = "1px solid";
//   document.body.appendChild(canvas);
//
//   //draw background
//   // var ctx = document.getElementById('canvas').getContext("2d")
//   // var xPos = 0, yPos =0
//   // for (var i = 0; i < recurser.length; i++) {
//   //   if (xPos > window.innerWidth) {
//   //     xPos = 0
//   //     yPos += 150
//   //     ctx.drawImage(recurser[i].image, xPos, yPos)
//   //     xPos += 150
//   //   }else {
//   //     ctx.drawImage(recurser[i].image, xPos, yPos)
//   //     xPos += 150
//   //   }
//   // }
//
//   // debugger
//   //
//   // var theWheel = new Winwheel({
//   //   'numSegments' : recurser.length,
//   //   'fillStyle'   : '#e7706f',
//   //   'lineWidth'   : 1
//   // });
// }

function spinWheel() {
  if (time < 1000) {
    time = time + (time/7)
    console.log(time)

    //change picture
    // var {image} = yItem(people)
    // document.getElementById('recurser-image').src = image
    setTimeout(spinWheel, time)
  }
}

function randomArrayItem(array) {
  return array[Math.floor(Math.random()*array.length)];
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
  if (result === 'granted') {
    console.info('Notification permission granted')
  }
});
function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
      body: theBody,
      icon: theIcon
  }
  var n = new Notification(theTitle,options);
  setTimeout(n.close.bind(n), 4000);
}
