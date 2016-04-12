var batches = [{"id":26,"name":"Spring 2, 2016","start_date":"2016-03-28","end_date":"2016-06-30"},{"id":25,"name":"Spring 1, 2016","start_date":"2016-02-08","end_date":"2016-04-28"},{"id":24,"name":"Winter 2, 2016","start_date":"2016-01-04","end_date":"2016-03-24"},{"id":23,"name":"Winter 1, 2015","start_date":"2015-11-09","end_date":"2016-02-04"},{"id":22,"name":"Fall 2, 2015","start_date":"2015-09-28","end_date":"2015-12-17"},{"id":21,"name":"Fall 1, 2015","start_date":"2015-08-17","end_date":"2015-11-05"},{"id":20,"name":"Summer 2, 2015","start_date":"2015-07-06","end_date":"2015-09-24"},{"id":19,"name":"Summer 1, 2015","start_date":"2015-05-26","end_date":"2015-08-13"},{"id":18,"name":"Spring 2, 2015","start_date":"2015-03-30","end_date":"2015-07-02"},{"id":17,"name":"Spring 1, 2015","start_date":"2015-02-16","end_date":"2015-05-07"},{"id":15,"name":"Winter 2, 2015","start_date":"2015-01-05","end_date":"2015-03-26"},{"id":16,"name":"Winter 1, 2014","start_date":"2014-11-17","end_date":"2015-02-12"},{"id":12,"name":"Fall 2, 2014","start_date":"2014-10-06","end_date":"2014-12-18"},{"id":14,"name":"Fall 1, 2014","start_date":"2014-09-02","end_date":"2014-11-13"},{"id":13,"name":"Summer 2, 2014","start_date":"2014-07-21","end_date":"2014-10-02"},{"id":11,"name":"Summer 1, 2014","start_date":"2014-06-09","end_date":"2014-08-28"},{"id":10,"name":"Winter 2014","start_date":"2014-02-10","end_date":"2014-05-01"},{"id":9,"name":"Fall 2013","start_date":"2013-09-30","end_date":"2013-12-19"},{"id":8,"name":"Summer 2013","start_date":"2013-06-03","end_date":"2013-08-22"},{"id":7,"name":"Winter 2013","start_date":"2013-02-11","end_date":"2013-05-02"},{"id":5,"name":"Fall 2012","start_date":"2012-10-01","end_date":"2012-12-20"},{"id":4,"name":"Summer 2012","start_date":"2012-06-04","end_date":"2012-08-25"},{"id":3,"name":"Winter 2012 (aka Batch[2])","start_date":"2012-02-13","end_date":"2012-05-02"},{"id":2,"name":"Fall 2011 (aka Batch[1])","start_date":"2011-09-27","end_date":"2011-12-15"},{"id":1,"name":"Summer 2011 (aka Batch[0])","start_date":"2011-07-18","end_date":"2011-08-18"}]

//TypeError: batches.filter is not a function
//only throws if it's invoked from server.js, working fine wenn calling node --flags RecurseCenterUtils.js

var utils = {
  filterActiveBatches: function (batches) {
    console.log('inside rcUtils',batches);
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

//console.log(utils.filterActiveBatches(batches));

module.exports = utils;
