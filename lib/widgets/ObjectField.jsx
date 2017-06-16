'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import Inferno from 'inferno'
import Component from 'inferno-component'
import { safeGet } from 'safe-utils'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import getWidgetAdapters from '../getWidgetAdapters'

function renderRows ({ schema, value, namespace, validationErrors, isMounted, customWidgets, onChange }) {
  const widgetAdapters = Object.keys(schema._fields).map((key) => {
    const field = schema._fields[key]
    const validationError = safeGet(() => validationErrors.fieldErrors[key])
    // Support readOnly
    // Support validation constraints

    const myNamespace = namespace.slice()
    myNamespace.push(key)
    const { InputFieldAdapter, RowAdapter } = getWidgetAdapters(field, myNamespace.join('.'), customWidgets)


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
      <Row adapter={RowAdapter} validationError={validationError} formIsMounted={isMounted}>
        <InputField adapter={InputFieldAdapter} propName={propName} value={value && value[propName]} options={{parentValue: value, lang: this.props.lang}} formIsMounted={isMounted} customWidgets={customWidgets} onChange={onChange}/>
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

  componentWillReceiveProps (nextProps) {
    // Because this is a container we set isMounted here instead of getting it from parent
    this.isMounted = true
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
          customWidgets: this.props.customWidgets,
          onChange: this.didUpdate,
          isMounted: this.isMounted
        })}
    </div>
  }
}

export default ObjectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IObjectField,
    Component: ObjectFieldWidget,
}).registerWith(globalRegistry)
