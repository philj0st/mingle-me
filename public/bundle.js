var time = 10
function spinWheel() {
  if (time < 1000) {
    time = time + (time/7)
    console.log(time)
    //debugger
    setTimeout(spinWheel, time)
  }
}

spinWheel()
