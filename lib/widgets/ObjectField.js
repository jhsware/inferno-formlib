'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import { Component } from 'inferno'
import { safeGet } from 'safe-utils'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import getWidgetAdapters from '../getWidgetAdapters'

function renderRows ({ schema, value, lang, namespace, inputName, validationErrors, isMounted, customWidgets, onChange }) {
  const widgets = Object.keys(schema._fields).map((propName) => {
    const field = schema._fields[propName]
    const validationError = safeGet(() => validationErrors.fieldErrors[propName])
    // Support readOnly
    // Support validation constraints

    const myNamespace = namespace.slice()
    myNamespace.push(propName)
    const { InputFieldAdapter, RowAdapter } = getWidgetAdapters(field, myNamespace.join('.'), customWidgets)

    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    const newInputName = (inputName && propName ? inputName + '[' + propName + ']' : inputName || propName)

    return (
      <Row adapter={RowAdapter} namespace={myNamespace} validationError={validationError} formIsMounted={isMounted} options={{lang: lang}}>
        <InputField
          adapter={InputFieldAdapter}
          namespace={myNamespace}
          inputName={newInputName}
          propName={propName}
          value={value && value[propName]}
          options={{parentValue: value, lang: lang}}
          formIsMounted={isMounted}
          customWidgets={customWidgets}
          
          onChange={onChange}/>
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
    return <div id={this.props.namespace.join(".") + "__Field"} className="InfernoFormlib-ObjectField">
        {renderRows({
          lang: this.props.options.lang,
          schema: field.schema,
          namespace: this.props.namespace || [],
          inputName: this.props.inputName,
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
