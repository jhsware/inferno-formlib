import Inferno from 'inferno'
import Component from 'inferno-component'
import { safeGet } from 'safe-utils'

import getWidgetAdapters from './getWidgetAdapters'

function renderFormRows ({ schema, value, validationErrors, namespace, isMounted, customWidgets, onChange }) {
  // TODO: Unpack the invariant errors so they can be found by field key

  let widgetAdapters = Object.keys(schema._fields).map((key) => {
    // Call the validationConstraint methods to figure out if the field should be validated
    const shouldValidate = schema._validationConstraints.reduce((prev, curr) => {
      return prev && curr(value, key)
    }, true)

    if (!shouldValidate)  {
      // Don't render fields that shouldn't be validated
      return
    }

    const field = schema._fields[key]
    const validationError = safeGet(() => validationErrors.fieldErrors[key])

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
        <InputField adapter={InputFieldAdapter} namespace={myNamespace} propName={propName} value={value[propName]} parentValue={value} validationError={validationError}  formIsMounted={isMounted} customWidgets={customWidgets} onChange={onChange}/>
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
    // TODO: This should be cached for performance
    const customWidgetDict = {}
    if (this.props.children) {
      let children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
      children.forEach((widget) => {
        // TODO: Does this code really work?
        customWidgetDict[widget.props.propPath] = {
          fieldWidget: widget.props.fieldWidget,
          rowWidget: widget.props.rowWidget
        }
      })
    }
    
    return <div className="InfernoFormlib-FormRows">
      {renderFormRows({
        schema: this.props.schema,
        namespace: this.props.namespace || [],
        value: this.props.value,
        validationErrors: this.props.validationErrors,
        isMounted: this.isMounted,
        customWidgets: customWidgetDict,
        onChange: this.props.onChange
      })}
    </div>
  }
}

export {
  FormRows
}
