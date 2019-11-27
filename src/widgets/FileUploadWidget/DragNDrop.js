
import { Component } from 'inferno'
import classNames from 'classnames'

export class DragNDrop extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inDragCount: 0,
      isDragging: false
    }

    // I need to bind these event handlers to this, and
    // I only want to do it once to make sure they can be
    // removed properly
    this.setDrag = this.setDrag.bind(this)
    this.onDocumentDrag = this.onDocumentDrag.bind(this)
    this.onDocumentDragEnd = this.onDocumentDragEnd.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidMount () {
    // TODO: Should we only register a single event handler here which
    // triggers dragStart? This is just a bit weird.
    this.dragStart()
  }

  componentWillUnmount () {
    this._unregisterEventHandlers()
  }
  
  setDrag (change) {
    let inDragCount = this.state.inDragCount + change

    if (inDragCount >= 0) {
      this.setState({
        inDragCount
      })
    }
  }

  element () {
    return this.dropArea
  }

  onDocumentDrag (e) {
    if (!this.state.isDragging) {
      this.setState({
        isDragging: true
      })
    }
  }

  onDocumentDragEnd (e) {
    if (this.state.isDragging && !e.relatedTarget) {
      this.setState({
        isDragging: false
      })
    }
  }

  onDragEnter (e) {
    e.preventDefault()
    this.setDrag(1)
  }

  onDragLeave (e) {
    this.setDrag(-1)
  }
  
  onDragEnd (e) {
    this._unregisterEventHandlers()
  }

  onDrop (e) {
    e.preventDefault()
    this.setState({
      inDragCount: 0,
      isDragging: false
    })

    if (this.props.multiFile) {
      var files = e.dataTransfer.files;
      this.props.onDrop(files)
    }
    else {
      var file = e.dataTransfer.files[0];
      // console.log("[DragNDrop] file:", file.name);
      this.props.onDrop(file, file.name)
    }

    // TODO: Why did we do this? It disables drag'n'drop
    // this._unregisterEventHandlers()
  }

  onDragOver (e){
    e.preventDefault();
  }

  dragStart () {
    this._registerEventHandlers()
  }

  _registerEventHandlers () {
    var el = this.element()
    if (el) {
      el.addEventListener('dragenter', this.onDragEnter)  
      el.addEventListener('dragleave', this.onDragLeave)
      el.addEventListener('dragover', this.onDragOver)
      el.addEventListener('drop', this.onDrop)
      el.addEventListener('dragend', this.onDragEnd)
    }
    document.addEventListener("dragenter", this.onDocumentDrag)
    document.addEventListener("dragleave", this.onDocumentDragEnd)
  }

  _unregisterEventHandlers () {
    var el = this.element()
    if (el) {
      el.removeEventListener('dragenter', this.onDragEnter)  
      el.removeEventListener('dragleave', this.onDragLeave)
      el.removeEventListener('dragover', this.onDragOver)
      el.removeEventListener('drop', this.onDrop)
      el.removeEventListener('dragend', this.onDragEnd)
    }
    document.removeEventListener("dragenter", this.ondDrag)
    document.removeEventListener("dragleave", this.onDocumentDragEnd)
  }

  render () {
    const cls = classNames('DragNDroppable', {
      'DragNDroppable--drag-hover' : this.state.inDragCount > 0,
      'DragNDroppable--drag': this.state.isDragging
    })

    return (
      <div className={cls} ref={(el) => { this.dropArea = el }}>
        {this.props.children}
      </div>
    )
  }
}
