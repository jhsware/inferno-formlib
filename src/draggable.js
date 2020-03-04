import { globalRegistry } from "component-registry"
import { IDraggableController } from "./interfaces"

const debug = typeof window !== 'undefined' && window.debugDraggable

const _debounceTimers = {}
function debounce (key, callback) {
    if (_debounceTimers[key] === undefined) {
        _debounceTimers[key] = window.requestAnimationFrame(() => {
            callback()
            delete _debounceTimers[key]
        })
    }
}

function getDraggable (node) {
    for (let target = node; !target.classList.contains('InfernoFormlib-DragContainer'); target = target.parentNode) {
        if (target.parentNode === null || target.parentNode.classList.contains('InfernoFormlib-DragContainer')) {
            return target
        }
    }
    return undefined
}

function getDragContainer (node) {
    const draggable = getDraggable(node)
    if (draggable) {
        return draggable.parentNode
    } else {
        return undefined
    }
}


export function handleDragStart (e) {
    if (!e.target.classList.contains('InfernoFormlib-DragItem')) {
        return
    }

    const draggable = getDraggable(e.target)
    this.currentDragContainer = getDragContainer(draggable)
    this.currentSource = this.currentTarget = draggable.getAttribute('data-drag-index')

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'

    // This is needed for drag to work in FF
    e.dataTransfer.setData('text', e.target.getAttribute('data-drag-index'))

    draggable.classList.add('InfernoFormlib-DragItem--isDragging')
    
    debug && _dragDebug(draggable, e)
}

export function getDraggableUtil(e) {
    const isDraggable = e.dataTransfer.types.reduce((prev, curr) => prev || curr.startsWith('inferno-formlib/draggable') ? curr : undefined, undefined)
    if (isDraggable === undefined) return

    const utilName = isDraggable.split('.')[1]
    if (utilName === undefined) return

    const util = globalRegistry.getUtilities(IDraggableController).reduce((prev, curr) => prev || (curr._name.toLowerCase() === utilName ? curr : undefined), undefined)
    return util
}

let currentMouseY
export function handleDragOver (e) {
    if (e.preventDefault) e.preventDefault()

    if (currentMouseY === e.clientY) return
    currentMouseY = e.clientY
    e.dataTransfer.dropEffect = 'move'

    const draggable = getDraggable(e.target)

    if (!draggable) return

    // We are now outside the container (in another container though...)
    if (getDragContainer(draggable) !== this.currentDragContainer) {
        // If we aren't dropping in the same container, we can look up a
        // IDraggableController to see if we are allowed to drop the drag
        const util = getDraggableUtil(e)
        if (!util || !util.mayDrop(this.currentSource, this.currentTarget)) return
    }

    debug && console.log("OVER: " + this.currentTarget + ":" + (_isAfter(draggable, e) ? 'after' : 'before'))
    _updateDragMarkers(draggable, e)

    debug && _dragDebug(draggable, e)

    // Only call this once on each animation frame and if the mouse has moved vertically
/*    debounce('handleDragOver', () => {
        if (currentMouseY === e.clientY) return
        currentMouseY = e.clientY
        e.dataTransfer.dropEffect = 'move'

        const draggable = getDraggable(e.target)
    
        _updateDragMarkers(draggable, e)

        debug && _dragDebug(draggable, e)
    }) */
}

export function handleDragEnter (e) {
    const draggable = getDraggable(e.target)
    if (draggable === undefined) return

    if (this.currentTarget !== draggable.getAttribute('data-drag-index')) {
        this.currentTarget = draggable.getAttribute('data-drag-index')
    }
    // _updateDragMarkers(draggable, e)
}

export function handleDragLeave (e) {
    const draggable = getDraggable(e.target)
    _clearDragMarkers(draggable, 'before', 'after')
}

export function handleDragEnd (e) {
    const draggable = getDraggable(e.target)

    draggable.classList.remove('InfernoFormlib-DragItem--isDragging')
    draggable.removeAttribute('draggable')
    this.currentDragContainer = undefined
    this.currentTarget = this.currentSource = undefined
}

export function handleDrop (e) {
    // If not called, drop event will try to rediriect in FF
    e.preventDefault()
    e.stopPropagation()

    const draggable = getDraggable(e.target)

    // Check if we are dropping outside drag container
    if (!draggable) return
    _clearDragMarkers(draggable, 'before', 'after')

    let util
    // We are now outside the container (in another container though...)
    if (getDragContainer(draggable) !== this.currentDragContainer) {
        // If we aren't dropping in the same container, we can look up a
        // IDraggableController to see if we are allowed to drop the drag
        util = getDraggableUtil(e)
        if (!util || !util.mayDrop(this.currentSource, this.currentTarget)) return
    }
    
    if (this.currentTarget === this.currentSource) {
        // Dropping on self
        return
    } else if (this.currentSource && this.currentTarget && this.currentTarget !== this.currentSource) {
        debug && console.log("DROP: " + this.currentTarget + ":" + (_isAfter(draggable, e) ? 'after' : 'before'))
        this.didDrop(this.currentSource, parseInt(this.currentTarget) + (_isAfter(draggable, e) ? 1 : 0))
    } else if (this.currentTarget) {
        // TODO: Lookup IDropObjectPrototypeFactory
        // const utilName = e.dataTransfer.utilName
        debug && console.log("DROP, Create: " + utilName + "=>" + this.currentTarget + ":" + (_isAfter(draggable, e) ? 'after' : 'before'))
        this.didDrop(util.getObject(), parseInt(this.currentTarget) + (_isAfter(draggable, e) ? 1 : 0))
    }
}

function _updateDragMarkers (el, e) {
    if (el && !el.classList.contains('InfernoFormlib-DragItem--isDragging')) {
        if (_isAfter(el, e)) {
            // Below middle
            _setDragMarkers(el, 'after')
            _clearDragMarkers(el, 'before')
        } else {
            // Above middle
            _setDragMarkers(el, 'before')
            _clearDragMarkers(el, 'after')
        }
    }
}

function _isAfter (el, e) {
    const boundRect = el.getBoundingClientRect()
    return (e.clientY > boundRect.top + boundRect.height / 2)
}

function _setDragMarkers (el) {
    if (!el) return

    const tmp = [...arguments]
    // Remove first argument
    tmp.shift()
    tmp.forEach((suffix) => {
        !el.classList.contains('InfernoFormlib-DragItem--' + suffix) && el.classList.add('InfernoFormlib-DragItem--' + suffix)
    })
}

function _clearDragMarkers (el) {
    if (!el) return

    const tmp = [...arguments]
    // Remove first argument
    tmp.shift()
    tmp.forEach((suffix) => {
        el.classList.contains('InfernoFormlib-DragItem--' + suffix) && el.classList.remove('InfernoFormlib-DragItem--' + suffix)
    })
}

function _dragDebug (el, e) {
    // TODO: Add a marker to show where the drag line is
    const boundRect = el.getBoundingClientRect()
    const dTop = el.offsetTop
    const dHeight = el.offsetHeight
    let dbgEl = document.getElementById('dragDebug')
    if (!dbgEl) {
        // Add to DOM
        dbgEl = document.createElement('div')
        dbgEl.setAttribute('id', 'dragDebug')
        dbgEl.setAttribute('style', 'position: absolute; left: 0; right: 0; height: 2px; background-color: red')
        document.body.appendChild(dbgEl, document.body)
    }
    dbgEl.style.top = window.scrollY + boundRect.top + 'px'

    let mouseEl = document.getElementById('mouseDragDebug')
    if (!mouseEl) {
        // Add to DOM
        mouseEl = document.createElement('div')
        mouseEl.setAttribute('id', 'mouseDragDebug')
        mouseEl.setAttribute('style', 'position: absolute; left: 0; right: 0; height: 2px; background-color: green')
        document.body.appendChild(mouseEl, document.body)
    }
    console.log(window.scrollY + e.clientY - boundRect.height / 2)
    mouseEl.style.top = window.scrollY + e.clientY + 'px'
}

// TODO: getAnimationFrame!!!