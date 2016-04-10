var batches = [
  {
    "id": 25,
    "name": "Winter 2, 2016",
    "start_date": "2016-03-28",
    "end_date": "2016-06-28"
  },
  {
    "id": 24,
    "name": "Winter 2, 2016",
    "start_date": "2016-01-04",
    "end_date": "2016-04-24"
  },
  {
    "id": 23,
    "name": "Winter 1, 2015",
    "start_date": "2015-11-09",
    "end_date": "2016-02-04"
  },
  {
    "id": 2,
    "name": "Fall 2011 (aka Batch[1])",
    "start_date": "2011-09-27",
    "end_date": "2011-12-15"
  },
  {
    "id": 1,
    "name": "Summer 2011 (aka Batch[0])",
    "start_date": "2011-07-18",
    "end_date": "2011-08-18"
  }
]

utils = {
  filterActiveBatches: function (batches) {
    return batches.filter((batch) => {
      var start_date = new Date(batch.start_date).getTime()
      var end_date = new Date(batch.end_date).getTime()
      var now = Date.now()

      if (now < end_date && now > start_date) {
        return true
      }else {
        return false
      }
    })
  }
}

module.exports = utils;
