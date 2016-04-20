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

module.exports = utils;
