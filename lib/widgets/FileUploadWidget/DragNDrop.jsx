'use strict';
import Inferno from 'inferno'
import Component from 'inferno-component'

import { renderString } from '../common'

var DragNDropOverlay = function(props) {
  return (
    <div className="InfernoFormlib-DropOverlay">
      <div className="InfernoFormlib-Center" >
        {renderString('InfernoFormlib-i18n-drop_to_upload', props.options && props.options.lang, 'Drag\'n\'drop to upload!')}
      </div>
    </div>
  )
}

export class DragNDrop extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inDragCount: 0
    }

    this.setDrag = this.setDrag.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.dragStart = this.dragStart.bind(this)
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

    // TODO: Handle upload and progress
    this.props.onDrop(file)

    /*
    var mediaApi = registry.getUtility(IApiPersistance, 'Media')
    mediaApi.create(file, function(err, media, file, tmpUrl){
        this.props.dropped && this.props.dropped(media, file, tmpUrl)
    }.bind(this), this.props.onProgress)
    */
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
      
  }

  componentDidMount () {
    this.dragStart()
  }
  
  render () {
    var classes = ["InfernoFormlib-DragNDroppable"];
    if (this.state.inDragCount > 0) {
      classes.push("InfernoFormlib-DragNDroppable--Dragging")
    }
    return (
      <div className={classes.join(' ')} ref={(el) => { this.dropArea = el }}>
        {this.props.children}
        {this.state.inDragCount > 0 && <DragNDropOverlay/>}
      </div>
    )
  }
}
