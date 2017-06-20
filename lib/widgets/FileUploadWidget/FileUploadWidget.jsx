'use strict'
/*

  To use this input widget adapter you need to register it with your
  adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

import classNames from 'classnames'
import { DragNDrop } from './DragNDrop'

// Placeholder

class InputWidget extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const field = this.props.field

    return (
      <DragNDrop onDrop={this.props.onChange}>
        {!this.props.hide &&
          <input
          id={this.props.namespace.join(".") + "__Field"}
          name={this.props.inputName}
          className="InfernoFormlib-FileField"
          type="file"

          onChange={(e) => {
            e.preventDefault()
            this.props.onChange(e.target.files[0])
          }} />}
        {this.props.children}
      </DragNDrop>
    )
  }
}

export default InputWidget
