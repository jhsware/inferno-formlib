let currentTarget
let currentSource

function getDraggable (node) {
    for (let target = node; !target.classList.contains('InfernoFormlib-DragContainer'); target = target.parentNode) {
        if (target.parentNode.classList.contains('InfernoFormlib-DragContainer')) {
            return target
        }
    }
    return undefined
}


export function handleDragStart (e) {
    const draggable = getDraggable(e.target)
    currentSource = currentTarget = draggable.getAttribute('data-drag-index')

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    // e.dataTransfer.setData('text', e.target.getAttribute('data-drag-index'))

    draggable.classList.add('InfernoFormlib-DragItem--isDragging')
}

export function handleDragOver (e) {
    if (e.preventDefault) e.preventDefault()

    e.dataTransfer.dropEffect = 'move'
}

export function handleDragEnter (e) {
    const draggable = getDraggable(e.target)
    if (draggable === undefined) return

    if (currentTarget !== draggable.getAttribute('data-drag-index')) {
        removeCurrentTargetOutline()
        currentTarget = draggable.getAttribute('data-drag-index')
    }

    if (!draggable.classList.contains('InfernoFormlib-DragItem--isDragging')) {
        draggable.classList.add('InfernoFormlib-DragItem--over')
    }
}

export function handleDragLeave (e) {
    const draggable = getDraggable(e.target)
    draggable.classList.remove('InfernoFormlib-DragItem--over')
}

export function handleDragEnd (e) {
    removeCurrentTargetOutline()

    const draggable = getDraggable(e.target)
    draggable.classList.remove('InfernoFormlib-DragItem--isDragging')
}

export function handleDrop (e) {
    e.stopPropagation()

    const draggable = getDraggable(e.target)
    if (draggable === undefined) return

    if (currentTarget !== currentSource) {
        this.props.onDrop(currentSource, currentTarget)
    }
    currentTarget = currentSource = undefined
}

function removeCurrentTargetOutline () {
    const target = document.querySelector(`.InfernoFormlib-DragItem--over`)
    if (target) target.classList.remove('InfernoFormlib-DragItem--over')
}
