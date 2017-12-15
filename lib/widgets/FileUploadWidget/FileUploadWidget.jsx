'use strict'
/*

  To use this input widget adapter you need to register it with your
  adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

import classNames from 'classnames'
import { DragNDrop } from './DragNDrop.jsx'

import { IFileUploadUtil } from '../../interfaces'

// Placeholder

class InputWidget extends Component {
  constructor (props) {
    super(props)

    this.didDrop = this.didDrop.bind(this)
  }

  didDrop (file) {
    this.props.onChange()
    /*
    var mediaApi = registry.getUtility(IFileUploadUtil, this.props.field.utilName || 'Image')
    mediaApi.upload(file, this.onProgress, (err, data) => {
        // TODO: Handle error
        this.props.onChange(this.props.name, data)
    })
    */
  }

  renderEmpty () {
    const field = this.props.field

    return (
      <div className="InfernoFormlib-FileUploadWidget">
        {this.props.value === undefined && <DragNDrop onDrop={this.didDrop}>
          {!this.props.hide && <span className="placeholder">{field.placeholder}</span>}
          {!this.props.hide &&
            <input
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            className="form-control-file"
            type="file"
            
            onChange={(e) => {
              e.preventDefault()
              this.props.onChange(e.target.files[0])
            }} />}
        </DragNDrop>}
        {this.props.value && this.props.children}
      </div>
    )
  }

  renderImage () {

  }

  render () {
    if (this.props.value === undefined) {
      return this.renderEmpty()
    } else {
      return this.props.children
    }
  }
}

export default InputWidget
