import Inferno from 'inferno'
import Component from 'inferno-component'

import { globalRegistry } from 'component-registry'
import { IInputFieldWidget, IFormRowWidget }  from './interfaces'


function renderFormRows ({ schema, value, errors, namespace, isMounted, onChange }) {
  // TODO: Unpack the invariant errors so they can be found by field key

  let widgetAdapters = Object.keys(schema._fields).map((key) => {
    // Call the validationConstraint methods to figure out if the field should be validated
    const shouldValidate = schema._validationConstraints.reduce((prev, curr) => {
      return prev && curr(value, key)
    }, true)

    if (!shouldValidate)  {
      // Don't render fields that shouldn't be validated
      return
    } else if (false) {
      // Check if a custom widget has been provided, in which case call it
    }

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

  // Remove undefined widgets
  widgetAdapters = widgetAdapters.filter((item) => item)

  const widgets = widgetAdapters.map(({RowAdapter, InputFieldAdapter, propName, validationError}) => {
    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    const myNamespace = namespace.slice()
    myNamespace.push(propName)

    // TODO: Key should be namespace parent.propName
    return (
      <Row key={myNamespace.join('.')} adapter={RowAdapter} validationError={validationError} formIsMounted={isMounted}>
        <InputField adapter={InputFieldAdapter} namespace={myNamespace} propName={propName} value={value[propName]} validationError={validationError}  formIsMounted={isMounted} onChange={onChange}/>
      </Row>
    )
  } )
  return widgets
}

class FormRows extends Component {

  componentWillReceiveProps (nextProps) {
    // I need this to pass to rows in order to avoid animations on first render
    this.isMounted = true
  }

  render () {
    return <div className="InfernoFormlib-FormRows">
      {renderFormRows({
        schema: this.props.schema,
        namespace: this.props.namespace || [],
        value: this.props.value,
        validationErrors: this.props.validationErrors,
        isMounted: this.isMounted,
        onChange: this.props.onChange
      })}
    </div>
  }
}

export {
  FormRows
}
