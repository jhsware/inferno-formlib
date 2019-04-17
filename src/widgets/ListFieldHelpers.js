'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Adapter } from 'component-registry'

import { Component } from 'inferno'
import { findDOMNode } from 'inferno-extras'
import { safeGet } from 'safe-utils'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import { interfaces } from 'isomorphic-schema'
import { IListRowContainerWidget }  from '../interfaces'
import getWidgetAdapters from '../getWidgetAdapters'

import { Button } from 'inferno-bootstrap'

class ListRowContainerWidget extends Component {
    constructor (props) {
        super(props)

        this.doMakeDraggable = this.doMakeDraggable.bind(this)
        this.doMakeUndraggable = this.doMakeUndraggable.bind(this)
    }

    componentDidMount () {
        if (!this.props.isFirstMount) {
            animateOnAdd(findDOMNode(this), 'InfernoFormlib-ListFieldRow--Animation')
        }
    }

    componentWillUnmount () {
        let domEl = findDOMNode(this)
        animateOnRemove(domEl, 'InfernoFormlib-ListFieldRow--Animation')
    }

    doMakeDraggable (e) {
        findDOMNode(this).setAttribute('draggable', true)
    }

    doMakeUndraggable (e) {
        findDOMNode(this).removeAttribute('draggable')
    }

    render () {
        return (
            <div className={"InfernoFormlib-ListFieldRow" + (this.props.className ? ' ' + this.props.className : '')} data-drag-index={this.props['data-drag-index']}>
                <div className="InfernoFormlib-DragHandle"
                    onMouseDown={this.doMakeDraggable}
                    onMouseUp={this.doMakeUndraggable} />
                
                {this.props.children}

                <div className="InfernoFormlib-ListFieldRowDeleteBtnWrapper">
                    <Button className="InfernoFormlib-ListFieldRowDeleteBtn"
                        color="danger"
                        onClick={(e) => {
                            e.preventDefault()
                            this.props.onDelete()
                        }}>Ta bort</Button>
                </div>
            </div>
        )
    }
}

new Adapter({
    implements: IListRowContainerWidget,
    adapts: interfaces.IListField,
    Component: ListRowContainerWidget,
})

function renderRows ({ field, value, lang, namespace, inputName, itemKeys, validationErrors, customWidgets, onInput, onChange, onDelete, isMounted }) {
  if (value === undefined) return


  return value.map((item, index) => {
    // Respect maxLength
    if (field.maxLength !== undefined && field.maxLength <= index) return

    const valueType = field.valueType
    let validationError = safeGet(() => validationErrors.errors[index])

    // Support readOnly
    // Support validation constraints    
    const myNamespaceByKey = namespace.concat([itemKeys[index].key]) // .concat returns a new array
    const myNamespace = namespace.concat([index])
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

    const { InputFieldAdapter, RowAdapter } = getWidgetAdapters(valueType, myNamespaceByKey.join('.'), customWidgets)

    const InputField = InputFieldAdapter.Component
    const Row = RowAdapter.Component

    // We need to know if this should be animated
    const justAdded = itemKeys[index].justAdded
    itemKeys[index].justAdded = false

    const newInputName = (inputName && index ? inputName + '[' + index + ']' : inputName || index)

    const ListRowContainer = new IListRowContainerWidget(field).Component

    const doesNotRenderLabel = RowAdapter.doesNotRenderLabel()

    const sharedProps = {
        namespace: myNamespace,
        propName: index,
        value: value && value[index],
        options: {parentValue: value, lang},
        validationError,
        formIsMounted: !justAdded,
        doesNotRenderLabel,
        id: dotName,
        // Callbacks
        onChange,
        onInput
    }
    return (
      <ListRowContainer
        className="InfernoFormlib-DragItem"
        key={myNamespaceByKey.join('.')}
        data-drag-index={index}
        isFirstMount={!isMounted}
        propName={index}
        value={value[index]}
        validationError={validationError}
        onChange={onChange}
        onDelete={() => onDelete(index)}>
        <Row
            adapter={RowAdapter} 
            {...sharedProps}>
            <InputField
                adapter={InputFieldAdapter}
                inputName={newInputName}
                customWidgets={customWidgets}
                {...sharedProps} />
        </Row>
      </ListRowContainer>
    )
  })
}

function Placeholder (props) {
    return <div className="InfernoFormlib-ListFieldPlaceholderContainer"> 
        <div className="InfernoFormlib-ListFieldPlaceholder">
            <div className="InfernoFormlib-ListFieldPlaceholderText">{props.text}</div>
        </div>
    </div>
}

export {
    ListRowContainerWidget,
    Placeholder,
    renderRows
}
