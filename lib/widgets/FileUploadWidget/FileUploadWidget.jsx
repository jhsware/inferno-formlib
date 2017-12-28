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
import Button from 'inferno-bootstrap/lib/Button'

// Placeholder

class FileUploadWidget extends Component {
  constructor (props) {
    super(props)

    this.state = {
      progress: undefined,
      errMsg: undefined
    }

    this.doUpload = this.doUpload.bind(this)
    this.didGetProgress = this.didGetProgress.bind(this)
    this.doClearError = this.doClearError.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== undefined && this.state.progress !== undefined) {
      this.setState({
        progress: undefined,
        errMsg: undefined
      })
    }
  }

  doClearError (e) {
    e.preventDefault()
    this.setState({
      progress: undefined,
      errMsg: undefined
    })
  }

  didGetProgress (perc) {
    this.setState({
      progress: perc,
      errMsg: undefined
    })
  }

  doUpload (file) {
    this.setState({
      progress: 0
    })
    var fileUploadUtil = registry.getUtility(IFileUploadUtil, this.props.uploadUtilName || 'Image')
    fileUploadUtil.upload(file, this.didGetProgress)
      .then((data) => {
        this.setState({
          progress: 100
        })
        this.props.onChange(this.props.name, data)
      })
      .catch((e) => {
        this.setState({
          errMsg: e.message
        })
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

  renderError () {
    return (
      <div className="InfernoFormlib-FileUploadWidget">
        <div className="Error">
          <div className="ErrorContainer">
            <p>{this.state.errMsg}</p>
            <Button onClick={this.doClearError} size="sm">Try again!</Button>
          </div>
        </div>
      </div>
    )
  }

  renderEmpty () {
    
    return (
      <div className="InfernoFormlib-FileUploadWidget">
        {this.props.value === undefined && <DragNDrop onDrop={this.doUpload}>
          {!this.props.hide && <span className="placeholder">{this.props.placeholder}</span>}
          {!this.props.hide &&
            <input
              id={this.props.id}
              name={this.props.name}
              className="form-control-file"
              type="file"
            
              onChange={(e) => {
                e.preventDefault()
                this.doUpload(e.target.files[0])
              }} />}
        </DragNDrop>}
        {this.props.value && this.props.children}
      </div>
    )
  }

  render () {
    if (this.props.value !== undefined) {
      return this.props.children
    } else if (this.state.errMsg) {
      return this.renderError()
    } else if (this.state.progress !== undefined) {
      return this.renderProgress()
    } else  {
      return this.renderEmpty()
    }
  }
}

export default FileUploadWidget
