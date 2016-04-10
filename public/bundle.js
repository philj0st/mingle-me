var time = 10
function spinWheel() {
  if (time < 9000) {
    time = time + (time/2)
    console.log(time)
    //debugger
    setTimeout(spinWheel, time)
  }
}

spinWheel()
