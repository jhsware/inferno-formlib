'use strict'
export function getElOffset (el) {
    var de = document.documentElement
    var box = el.getBoundingClientRect()
    var top = box.top + window.pageYOffset - de.clientTop
    var left = box.left + window.pageXOffset - de.clientLeft
    return { top, left }
}

const reDot = /\./g
export function escapeIdSelector (id) {
    return id.replace(reDot, '\\.')
}

const reStartingNr = /(^\d)/
export function generateId (namespace, suffix) {
    return (namespace.join('.') + suffix).replace(reStartingNr, '_$1')
}


/**
 * Throttle calls to avoid overloading an API or other service
 * 
 * Example:
 * 
 * const __timerName__ = '_optionsTimer'
 * throttle.call(this, 300, __timerName__).then((timer) => {
 *   _yourAsyncMethod().then((res) => {
 *     // Only do stuff if this is the latest executing timer
 *     if (this[__timerName__] === timer) {
 *       // Do something
 *     }
 *   })
 * })
 * 
 * 
 * @param {*} timeout
 * @param {*} propName
 */
export function throttle (timeout, propName) {
    if (this[propName]) clearTimeout(this[propName])

    return new Promise((resolve, reject) => {
        const tmpTimer = this[propName] = setTimeout(function () {
            resolve(tmpTimer)
        }, timeout)
    })
}
