'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { safeGet } from 'safe-utils'
import getWidgetAdapters from '../getWidgetAdapters'

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

    const doesNotRenderLabel = RowAdapter.doesNotRenderLabel()

    const sharedProps = {
      namespace: myNamespace,
      propName,
      value: value && value[propName],
      options: {parentValue: value, lang},
      validationError,
      formIsMounted: isMounted,
      doesNotRenderLabel,
      id: dotName,
      // Callbacks
      onChange,
      onInput
    }
    // TODO: Key should be namespace parent.propName?
    return (
      <Row key={myNamespace.join('.')}
        adapter={RowAdapter}
        {...sharedProps}>
        <InputField 
          adapter={InputFieldAdapter}
          inputName={newInputName}
          customWidgets={customWidgets}
          {...sharedProps} />
      </Row>
    )
  })
  return widgets
}

export {
  renderRows
}
