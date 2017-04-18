import Inferno from 'inferno'
import Component from 'inferno-component'

import { globalRegistry } from 'component-registry'
import { IInputFieldWidget, IFormRowWidget }  from './interfaces'


function renderFormRows (schema, value, errors, onChange) {
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
        <InputField adapter={InputFieldAdapter} propName={propName} value={value[propName]} validationError={validationError} onChange={onChange}/>
      </Row>
    )
  } )
  return widgets
}

function FormRows (props) {
  return <div className="InfernoFormlib-FormRows">
    {renderFormRows(props.schema, props.value, props.validationErrors, props.onChange)}
  </div>
}

export {
  FormRows
}
