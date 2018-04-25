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