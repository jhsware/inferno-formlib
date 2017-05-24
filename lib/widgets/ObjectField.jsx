'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import Inferno from 'inferno'
import Component from 'inferno-component'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget, IFormRowWidget }  from '../interfaces'

function renderRows ({ schema, value, namespace, errors, onChange }) {
  const widgetAdapters = Object.keys(schema._fields).map((key) => {
    const field = schema._fields[key]
    const validationError = errors && errors.fieldErrors[key]
    // Support readOnly
    // Support validation constraints
    const InputFieldAdapter = globalRegistry.getAdapter(field, IInputFieldWidget)
    const RowAdapter = globalRegistry.getAdapter(field, IFormRowWidget)
    return {
      validationError: validationError,
      propName: key,
      RowAdapter: RowAdapter,
      InputFieldAdapter: InputFieldAdapter
    }
  })

  const widgets = widgetAdapters.map(({RowAdapter, InputFieldAdapter, propName, validationError}) => {
    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    return (
      <Row adapter={RowAdapter} validationError={validationError}>
        <InputField adapter={InputFieldAdapter} propName={propName} value={value && value[propName]} onChange={onChange}/>
      </Row>
    )
  } )
  return widgets
}

export class ObjectFieldWidget extends Component {

  constructor (props) {
    super(props)

    this.didUpdate = this.didUpdate.bind(this)
  }

  didUpdate (propName, data) {
    const value = this.props.value || {}
    value[propName] = data
    this.props.onChange(this.props.propName, value)
  }

  render() {
    const field = this.props.adapter.context
    return <div className="InfernoFormlib-ObjectField">
        {renderRows({
          schema: field.schema,
          namespace: this.props.namespace || [],
          value: this.props.value,
          validationErrors: this.props.validationError,
          onChange: this.didUpdate
        })}
    </div>
  }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IObjectField,
    Component: ObjectFieldWidget,
}).registerWith(globalRegistry)
