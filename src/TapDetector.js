/**
 * Detect double tap events
 * # Deals with:
 * - Time intervals between taps
 * - Swipe will stop the taps
 * # Usage:
 * let tapDetector = new TapDetector()
 * tapDetector.attach(this.$el) // in mounted
 * tapDetector.detach(this.$el) // in destroy
 * tapDetector.onSingle(callback)
 * tapDetector.onDouble(callback)
 */

function TapDetector () {

  // Callbacks -----------------------------------------------------------------

  let singleTapCallbacks = []
  let doubleTapCallbacks = []

  function triggerCallbacks (cbList, arg) {
    cbList.forEach(cbItem => {
      cbItem.call(null, arg)
    })
  }

  this.onSingleTap = function (cb) {
    if (typeof cb === 'function' && !singleTapCallbacks.includes(cb)) {
      singleTapCallbacks.push(cb)
    }
  }
  this.onDoubleTap = function (cb) {
    if (typeof cb === 'function' && !doubleTapCallbacks.includes(cb)) {
      doubleTapCallbacks.push(cb)
    }
  }

  this.attach = function (dom) {
    if (!(dom instanceof Element)) {
      console.error('TapDetector.attach: arg must be an Element')
      return
    }
    dom.addEventListener('touchstart', onTouchStart)
    dom.addEventListener('touchmove', onTouchMove)
    dom.addEventListener('touchend', onTouchEnd)
    dom.addEventListener('mousedown', onMouseDown)
    dom.addEventListener('mouseup', onMouseUp)
    dom.addEventListener('mousemove', onMouseMove)
  }

  this.detach = function (dom) {
    dom.removeEventListener('touchstart', onTouchStart)
    dom.removeEventListener('touchmove', onTouchMove)
    dom.removeEventListener('touchend', onTouchEnd)
    dom.removeEventListener('mousedown', onMouseDown)
    dom.removeEventListener('mouseup', onMouseUp)
    dom.removeEventListener('mousemove', onMouseMove)
  }

  // Main logic ----------------------------------------------------------------

  // in touch mode mouse events will be disabled. Otherwise touches will
  // trigger both touchend end mouseup, i.e. one touch triggers two onPointerUp.
  let isTouchMode = false
  let lastTapTimestamp = 0
  let tappedCount = 0
  let touchMovedLength = 0
  let lastPointerX = 0
  let lastPointerY = 0

  function onTouchStart (ev) {
    isTouchMode = true
    // console.log('onTouchStart')
    if (ev.touches.length === 1) {
      onPointerDown(ev.touches[0].clientX, ev.touches[0].clientY)
    }
  }
  function onTouchEnd (ev) {
    // console.log('onTouchEnd')
    if (ev.touches.length === 0) {
      onPointerUp()
    }
  }
  function onTouchMove (ev) {
    // console.log('onTouchMove', ev)
    if (ev.touches.length === 1) {
      onPointerMove(ev.touches[0].clientX, ev.touches[0].clientY)
    }
  }

  function onMouseDown (ev) {
    if (isTouchMode) return

    // console.log('onMouseDown')
    onPointerDown(ev.clientX, ev.clientY)
  }
  function onMouseUp (ev) {
    if (isTouchMode) return

    // console.log('onMouseUp')
    onPointerUp()
  }
  function onMouseMove (ev) {
    if (isTouchMode) return

    // console.log('onMouseMove', ev)
    if (ev.button === 0) {
      onPointerMove(ev.clientX, ev.clientY)
    }
  }

  function onPointerDown (x, y) {
    lastPointerX = x
    lastPointerY = y
    touchMovedLength = 0
  }
  function onPointerUp () {
    let currTimeStamp = Date.now()
    // console.log('touchMovedLength', touchMovedLength)
    if (touchMovedLength < 10) {
      // Only when no sliding two far is considered as a valid tap
      if (currTimeStamp - lastTapTimestamp < 300) {
        tappedCount += 1
      } else {
        tappedCount = 1
      }
      lastTapTimestamp = Date.now()
      // console.log('tappedCount', tappedCount)
      triggerCallbacks(singleTapCallbacks, {
        clientX: lastPointerX,
        clientY: lastPointerY,
      })
      if (tappedCount === 2) {
        triggerCallbacks(doubleTapCallbacks, {
          clientX: lastPointerX,
          clientY: lastPointerY,
        })
        tappedCount = 0 // clear count on maximum tap count
      }
    }
    touchMovedLength = 0
  }
  function onPointerMove (x, y) {
    let deltaX = lastPointerX - x
    let deltaY = lastPointerY - y
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    // console.log('onTouchMove length', length)
    touchMovedLength += length
    lastPointerX = x
    lastPointerY = y
  }
}

export default TapDetector
