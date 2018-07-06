import { Component } from 'inferno'
import { safeGet } from 'safe-utils'
import classnames from 'classnames'

import getWidgetAdapters from './getWidgetAdapters'

function renderFormRows ({ schema, value, selectFields, omitFields, lang, disableI18n, validationErrors, namespace, inputName, isMounted, customWidgets, onInput, onChange }) {
  // TODO: Unpack the invariant errors so they can be found by field key

  let renderFields =  Object.keys(schema._fields)
  if (Array.isArray(selectFields)) {
    renderFields = renderFields.filter((key) => selectFields.indexOf(key) >= 0)
  }
  if (Array.isArray(omitFields)) {
    renderFields = renderFields.filter((key) => omitFields.indexOf(key) < 0)
  }

  let widgetAdapters = renderFields.map((key) => {
    // Call the validationConstraint methods to figure out if the field should be validated
    const shouldValidate = schema._validationConstraints.reduce((prev, curr) => {
      return prev && curr(value, key)
    }, true)

    if (!shouldValidate) {
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

    const newInputName = (inputName && propName ? inputName + '[' + propName + ']' : inputName || propName)

    // TODO: Key should be namespace parent.propName
    return (
      <Row key={myNamespace.join('.')} namespace={myNamespace} adapter={RowAdapter} value={value[propName]} validationError={validationError} formIsMounted={isMounted} options={{lang, disableI18n}}>
        <InputField 
          adapter={InputFieldAdapter}
          namespace={myNamespace}
          inputName={newInputName}
          propName={propName}
          value={value[propName]}
          options={{parentValue: value, lang, disableI18n}}
          validationError={validationError}
          formIsMounted={isMounted}
          customWidgets={customWidgets}
          
          onInput={onInput}
          onChange={onChange}/>
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

    

    return <div className={classnames('InfernoFormlib-FormRows', this.props.className)}>
      {renderFormRows({
        schema: this.props.schema,
        namespace: this.props.namespace || [],
        inputName: this.props.inputName,
        value: this.props.value,
        selectFields: (typeof this.props.selectFields === 'string' ? this.props.selectFields.split(',').map((k) => k.trim()) : this.props.selectFields),
        omitFields: (typeof this.props.omitFields === 'string' ? this.props.omitFields.split(',').map((k) => k.trim()) : this.props.omitFields),
        lang: this.props.lang,
        disableI18n: this.props.options && this.props.options.disableI18n,

        validationErrors: this.props.validationErrors,
        isMounted: this.isMounted,
        customWidgets: customWidgetDict,
        onInput: this.props.onInput,
        onChange: this.props.onChange
      })}
    </div>
  }
}

export {
  FormRows
}