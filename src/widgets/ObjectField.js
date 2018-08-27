'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import { Component } from 'inferno'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import { generateId } from './utils'
import { renderRows } from './ObjectFieldHelpers'

export default class ObjectFieldWidget extends Component {

  constructor (props) {
    super(props)

    this.didUpdate = this.didUpdate.bind(this)
    this.didInput = this.didInput.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Because this is a container we set isMounted here instead of getting it from parent
    this.isMounted = true
  }

  didInput (propName, data) {
    const value = this.props.value || {}
    value[propName] = data
    this.props.onInput && this.props.onInput(this.props.propName, value)
  }

  didUpdate (propName, data) {
    const value = this.props.value || {}
    value[propName] = data
    this.props.onChange(this.props.propName, value)
  }

  render() {
    const field = this.props.adapter.context
    return <div id={generateId(this.props.namespace, '__Field')} className="InfernoFormlib-ObjectField">
        {renderRows({
          lang: this.props.options && this.props.options.lang,
          
          schema: field.schema,
          namespace: this.props.namespace || [],
          inputName: this.props.inputName,
          value: this.props.value,
          validationErrors: this.props.validationError,
          customWidgets: this.props.customWidgets,

          onInput: this.didInput,
          onChange: this.didUpdate,
          isMounted: this.isMounted
        })}
    </div>
  }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IObjectField,
    Component: ObjectFieldWidget,
}).registerWith(globalRegistry)
