import { Component } from 'inferno'
import { safeGet } from 'safe-utils'
import classnames from 'classnames'

import getWidgetAdapters from './getWidgetAdapters'

function renderFormRows ({ schema, value, selectFields, omitFields, lang, validationErrors, namespace, inputName, isMounted, customWidgets, onInput, onChange }) {
  let renderFields =  Object.keys(schema._fields)
  let dottedNamespace = Array.isArray(namespace) ? namespace.join('.') : ''

  if (Array.isArray(selectFields) && selectFields.length > 0) {
    renderFields = renderFields.filter((key) => {
      const dottedName = dottedNamespace ? `${dottedNamespace}.${key}` : key
      const tmp = selectFields.filter((sel) => sel === dottedName || sel.startsWith(dottedName + '.'))
      return tmp.length > 0
    })
    // Remove root level props so they aren't counted when we pass on to next level
    // so we can select all if none are passed
    selectFields = selectFields.filter((key) => key.indexOf('.') >= 0)
  }
  if (Array.isArray(omitFields)) {
    renderFields = renderFields.filter((key) => {
      const dottedName = dottedNamespace ? `${dottedNamespace}.${key}` : key
      return omitFields.indexOf(dottedName) < 0
    })
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
    let validationError = safeGet(() => validationErrors && validationErrors.fieldErrors && validationErrors.fieldErrors[key])
    
    const myNamespace = namespace.concat([key]) // .concat returns a new array
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

    return {
      validationError,
      propName: key,
      RowAdapter,
      InputFieldAdapter
    }
  })

  // Remove undefined widgets
  widgetAdapters = widgetAdapters.filter((item) => item)
  
  const widgets = widgetAdapters.map(({RowAdapter, InputFieldAdapter, propName, validationError}) => {
    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    const doesNotRenderLabel = RowAdapter.doesNotRenderLabel()

    const myNamespace = namespace.concat([propName]) // .concat returns a new array

    const newInputName = (inputName && propName ? inputName + '[' + propName + ']' : inputName || propName)

    const myId = myNamespace.join('.')

    const sharedProps = {
      id: myId,
      namespace: myNamespace,
      doesNotRenderLabel,
      propName,
      value: value && value[propName],
      options: {parentValue: value, lang},
      validationError,
      formIsMounted: isMounted,
      // Callbacks
      onChange,
      onInput
    }
    // TODO: Key should be namespace parent.propName
    return (
      <Row key={myNamespace.join('.')}
        adapter={RowAdapter}
        {...sharedProps}>
        <InputField 
          adapter={InputFieldAdapter}
          inputName={newInputName}
          customWidgets={customWidgets}
          selectFields={selectFields}
          omitFields={omitFields}
          {...sharedProps} />
      </Row>
    )
  })
  return widgets
}

class FormRows extends Component {

  componentWillReceiveProps (nextProps) {
    // I need this to pass to rows in order to avoid animations on first render
    this.isMounted = true
  }

  getChildContext () {
    // Pass along the existing context
    const outp = {}
    for (let k in this.context) {
      outp[k] = this.context[k]
    }
    
    // And add our extra helpers
    outp['renderHelpAsHtml'] = this.props.renderHelpAsHtml || this.context.renderHelpAsHtml || false
    if (!this.context.hasOwnProperty('rootValue')) {
      outp['rootValue'] = this.props.value
    }

    return outp
  }

  render () {
    const customWidgetDict = {}
    if (this.props.children) {
      let children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
      children.forEach((widget) => {
        customWidgetDict[widget.props.propPath] = {
          fieldWidget: widget.props.fieldWidget,
          rowWidget: widget.props.rowWidget
        }
      })
    }

    
    // TODO: We should remove onInput and pass all changes down the chain to onChange
    return <div className={classnames('InfernoFormlib-FormRows', this.props.className)}>
      {renderFormRows({
        schema: this.props.schema,
        namespace: this.props.namespace || [],
        inputName: this.props.inputName,
        value: this.props.value,
        selectFields: (typeof this.props.selectFields === 'string' ? this.props.selectFields.split(',').map((k) => k.trim()) : this.props.selectFields),
        omitFields: (typeof this.props.omitFields === 'string' ? this.props.omitFields.split(',').map((k) => k.trim()) : this.props.omitFields),
        lang: this.props.lang,

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
  FormRows,
  renderFormRows
}
