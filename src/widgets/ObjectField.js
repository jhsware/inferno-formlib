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
import { generateId } from './utils'

function renderRows ({ schema, value, lang, namespace, inputName, validationErrors, isMounted, customWidgets, onInput, onChange }) {
  const widgets = Object.keys(schema._fields).map((propName) => {
    // Call the validationConstraint methods to figure out if the field should be validated
    const shouldValidate = schema._validationConstraints.reduce((prev, curr) => {
      return prev && curr(value, propName)
    }, true)

    if (!shouldValidate) {
      // Don't render fields that shouldn't be validated
      return
    }
    
    const field = schema._fields[propName]
    let validationError = safeGet(() => validationErrors.fieldErrors[propName])
    // Support readOnly
    // Support validation constraints
    const myNamespace = namespace.concat([propName]) // .concat returns a new array
    const dotName = myNamespace.join('.')

    // Unpack the invariant errors so they can be found by field key
    const tmpInvariantErrors = safeGet(() => validationErrors && validationErrors.invariantErrors && validationErrors.invariantErrors.filter((invErr) => {
      // Pattern match field name of error with current namespace to see if it is a match
      return invErr.fields.reduce((prev, curr) => prev || (curr.indexOf(dotName) === 0), false)
    }))

    if (Array.isArray(tmpInvariantErrors) && tmpInvariantErrors.length > 0) {
      if (!validationError) validationError = {}
      validationError.invariantErrors = tmpInvariantErrors
    }
    
    const { InputFieldAdapter, RowAdapter } = getWidgetAdapters(field, myNamespace.join('.'), customWidgets)

    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    const newInputName = (inputName && propName ? inputName + '[' + propName + ']' : inputName || propName)

    return (
      <Row
        key={myNamespace.join('.')}
        adapter={RowAdapter}
        namespace={myNamespace}
        value={value && value[propName]}
        validationError={validationError}
        formIsMounted={isMounted}
        options={{lang}}>
        <InputField
          adapter={InputFieldAdapter}
          namespace={myNamespace}
          inputName={newInputName}
          propName={propName}
          value={value && value[propName]}
          options={{parentValue: value, lang}}
          validationError={validationError}
          formIsMounted={isMounted}
          customWidgets={customWidgets}
          
          onInput={onInput}
          onChange={onChange} />
      </Row>
    )
  } )
  return widgets
}

export class ObjectFieldWidget extends Component {

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

export default ObjectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IObjectField,
    Component: ObjectFieldWidget,
}).registerWith(globalRegistry)
