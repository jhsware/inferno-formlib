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

    this.state = {
      progress: undefined
    }

    this.didDrop = this.didDrop.bind(this)
    this.onProgress = this.onProgress.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== undefined && this.state.progress !== undefined) {
      this.setState({
        progress: undefined
      })
    }
  }

  onProgress (perc) {
    this.setState({
      progress: perc
    })
  }

  didDrop (file) {
    this.setState({
      progress: 0
    })
    var fileUploadUtil = registry.getUtility(IFileUploadUtil, this.props.field.utilName || 'Image')
    fileUploadUtil.upload(file, this.onProgress)
      .then((data) => {
        this.setState({
          progress: 100
        })
        this.props.onChange(this.props.name, data)
      })
      // TODO: Handle error
  }

  renderProgress () {
    return (
      <div className="InfernoFormlib-FileUploadWidget">
        <div className="Uploading">
          <div className="ProgressContainer">
            <div className="ProgressBar" style={{ width: this.state.progress + '%'}} />
          </div>
        </div>
      </div>
    )
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

  render () {
    if (this.props.value !== undefined) {
      return this.props.children
    } else if (this.state.progress !== undefined) {
      return this.renderProgress()
    } else  {
      return this.renderEmpty()
    }
  }
}

export default InputWidget
