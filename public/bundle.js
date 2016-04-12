var people = [
  {
    "id": 739,
    "first_name": "Michael",
    "middle_name": "Robert",
    "last_name": "Arntzenius",
    "email": "daekharel@gmail.com",
    "twitter": "arntzenius",
    "github": "rntz",
    "batch_id": 11,
    "phone_number": "412 426 0065",
    "has_photo": true,
    "interests": "pl, Systems, Compilers, C, Python, Lisp, Scheme, Haskell, agda, twelf, Category theory, logic, Teaching",
    "before_rc": null,
    "during_rc": null,
    "is_faculty": false,
    "is_hacker_schooler": true,
    "job": "Student at CMU",
    "image": "https://d29xw0ra2h4o4u.cloudfront.net/assets/people/michael_robert_arntzenius_150-099dcc8e422ec63f3c2f57e30a2c32202c8bb6bbd2944165eb2a5101883d2c04.jpg",
    "batch": {
      "id": 11,
      "name": "Summer 1, 2014",
      "start_date": "2014-06-09",
      "end_date": "2014-08-28"
    },
    "pseudonym": "Pillow Venezuelan",
    "current_location": null,
    "projects": [

    ],
    "links": [

    ],
    "skills": [

    ],
    "bio": "I'm a PhD student at CMU, currently on a year's leave of absence. I like programming languages and systems - OS kernels, database engines, distributed systems, GCs, language runtimes, that sort of stuff.\r\n\r\nI'm language-agnostic; I know many and I will learn more. I like functional programming but I've worked on imperative codebases. The problem and the techniques are what most interest me; language, style, framework are secondary.\r\n\r\nI'm willing to move. I'm probably heading back to academia in a year, so primarily looking for an internship, but could be convinced otherwise. "
  },
  {
    "id": 736,
    "first_name": "Nava",
    "middle_name": "",
    "last_name": "Balsam",
    "email": "nava00@gmail.com",
    "twitter": "",
    "github": "nava00",
    "batch_id": 11,
    "phone_number": "",
    "has_photo": true,
    "interests": "Matlab, Mathematica, Python, Math, basic signal processing, JavaScript",
    "before_rc": null,
    "during_rc": null,
    "is_faculty": false,
    "is_hacker_schooler": true,
    "job": "Student at Columbia University",
    "image": "https://d29xw0ra2h4o4u.cloudfront.net/assets/people/nava_balsam_150-2210bb829e7d2752a26a5004a5b3799af8f727fce826adab8d5e30d6b3dcfff3.jpg",
    "batch": {
      "id": 11,
      "name": "Summer 1, 2014",
      "start_date": "2014-06-09",
      "end_date": "2014-08-28"
    },
    "pseudonym": "Example Pie",
    "current_location": null,
    "projects": [

    ],
    "links": [

    ],
    "skills": [

    ],
    "bio": "I enjoy the kind of programming that involves analytic and quantitative thinking.\r\n\r\nI'm currently in my last year of a PhD program in pure math at Columbia University and I have an undergraduate degree in EE where I focused on signal processing. At hacker school I learned to use tools beyond Matlab and Mathematica, and I am most comfortable in python. \r\n\r\nI enjoy working on problems with a mathematical bent but I have worked on a variety of projects in order to broaden my skills and they have been a lot of fun."
  },
  {
    "id": 750,
    "first_name": "Jasmine",
    "middle_name": "",
    "last_name": "Yan",
    "email": "jasmineyan@college.harvard.edu",
    "twitter": "",
    "github": "jazyan",
    "batch_id": 11,
    "phone_number": "908-205-7144",
    "has_photo": true,
    "interests": null,
    "before_rc": null,
    "during_rc": null,
    "is_faculty": false,
    "is_hacker_schooler": true,
    "job": "Student at Harvard",
    "image": "https://d29xw0ra2h4o4u.cloudfront.net/assets/people/jasmine_yan_150-e97f865484014903d8affc697aacc62be79fc2f40deb51be7f52c58f8fd0115c.jpg",
    "batch": {
      "id": 11,
      "name": "Summer 1, 2014",
      "start_date": "2014-06-09",
      "end_date": "2014-08-28"
    },
    "pseudonym": "Pendulum Soybean",
    "current_location": null,
    "projects": [

    ],
    "links": [

    ],
    "skills": [

    ],
    "bio": "Current Applied Math/CS undergrad at Harvard. I like things that are simple to grasp, but hard to master. I enjoy games/puzzles, algorithms, and Python, and am interested in cryptography, machine learning, and functional programming. I used to play Go and basketball competitively, but now I play just for fun :)"
  },
  {
    "id": 734,
    "first_name": "Raymond",
    "middle_name": "",
    "last_name": "Zeng",
    "email": "raymond.dot.zeng@gmail.com",
    "twitter": "_raymondzeng",
    "github": "raymondzeng",
    "batch_id": 11,
    "phone_number": "",
    "has_photo": true,
    "interests": "Java, Python, JavaScript, Git, Flask, HTML, CSS, Haskell",
    "before_rc": null,
    "during_rc": null,
    "is_faculty": false,
    "is_hacker_schooler": true,
    "job": "Student at Brown",
    "image": "https://d29xw0ra2h4o4u.cloudfront.net/assets/people/raymond_zeng_150-92071ef758edd2642a2e63c92a23d22a61ea4452ec725e00a96be466bc02ad9c.jpg",
    "batch": {
      "id": 11,
      "name": "Summer 1, 2014",
      "start_date": "2014-06-09",
      "end_date": "2014-08-28"
    },
    "pseudonym": "Department Pin",
    "current_location": null,
    "projects": [

    ],
    "links": [

    ],
    "skills": [

    ],
    "bio": "Undergrad at Brown. Interested in any kind of application development, algorithms, and functional programming.\r\n"
  }
]

var time = 10
var ctx = document.getElementById("canvas").getContext("2d")

function preLoadImages(people, callback) {
  let images = []
  let imagePromises = people.map((person) => {new Promise(function(resolve, reject) {
    let img = new Image()
    img.src = person.image
    img.addEventListener('load', function (e) {
      resolve(img)
    })
  });})
  Promise.all(imagePromises).then((values) => {
    console.log(values);
    callback(null, values)
  })
}


function spinWheel() {
  if (time < 1000) {
    time = time + (time/7)
    console.log(time)

    //change picture
    var {image} = randomArrayItem(people)
    document.getElementById('recurser-image').src = image
    setTimeout(spinWheel, time)
  }
}

function randomArrayItem(array) {
  return item = array[Math.floor(Math.random()*array.length)];
}

document.getElementById('spinButton').addEventListener('click', () => {
  spinWheel()
})

preLoadImages(people, function (err, res) {
  console.log(res);
})
