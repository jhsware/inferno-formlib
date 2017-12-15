'use strict';
import Inferno from 'inferno'
import Component from 'inferno-component'
import classNames from 'classnames'

import { renderString } from '../common'

export class DragNDrop extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inDragCount: 0,
      isDragging: false
    }

    this.setDrag = this.setDrag.bind(this)
    this.onDocumentDrag = this.onDocumentDrag.bind(this)
    this.onDocumentDragEnd = this.onDocumentDragEnd.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  setDrag (change) {
    this.setState({
      inDragCount: this.state.inDragCount + change
    })
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
    if (this.state.inDragCount == 0){
      console.log("[DragNDrop] onDragEnter", e.target);
    }
    this.setDrag(1)
  }

  onDragLeave (e) {
    this.setDrag(-1)
    if (this.state.inDragCount == 0) {
      console.log("[DragNDrop] onDragLeave");
    }
  }

  onDrop (e) {
    e.preventDefault()
    this.setDrag(0 - this.state.inDragCount);
    var file = e.dataTransfer.files[0];

    console.log("[DragNDrop] file:", file.name);

    this.props.onDrop(file)
  }

  onDragOver (e){
    e.preventDefault();
  }

  dragStart () {
    // TODO: removeEventListeners
    var el = this.element()
    if (el) {
      el.addEventListener('dragenter', this.onDragEnter)  
      el.addEventListener('dragleave', this.onDragLeave)
      el.addEventListener('dragover', this.onDragOver)
      el.addEventListener('drop', this.onDrop)
    }
    
    document.addEventListener("dragenter", this.onDocumentDrag)
    document.addEventListener("dragleave", this.onDocumentDragEnd)
  }

  componentDidMount () {
    this.dragStart()
  }

  componentWillUnmount () {
    var el = this.element()
    if (el) {
      el.removeEventListener('dragenter', this.onDragEnter)  
      el.removeEventListener('dragleave', this.onDragLeave)
      el.removeEventListener('dragover', this.onDragOver)
      el.removeEventListener('drop', this.onDrop)
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
