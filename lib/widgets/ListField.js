'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import { Component } from 'inferno'
import { safeGet } from 'safe-utils'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget, IListRowContainerWidget }  from '../interfaces'
import getWidgetAdapters from '../getWidgetAdapters'
import { renderString } from './common'
import { generateId } from './utils'

import Button from 'inferno-bootstrap/lib/Button'

import { handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDragEnd, handleDrop } from '../draggable'

class ListRowContainerWidget extends Component {
    constructor (props) {
        super(props)

        this.doMakeDraggable = this.doMakeDraggable.bind(this)
        this.doMakeUndraggable = this.doMakeUndraggable.bind(this)
    }

    componentDidMount () {
        if (!this.props.isFirstMount) {
            animateOnAdd(this.$V.dom, 'InfernoFormlib-ListFieldRow--Animation')
        }
    }

    componentWillUnmount () {
        let domEl = this.$V.dom
        animateOnRemove(domEl, 'InfernoFormlib-ListFieldRow--Animation')
    }

    doMakeDraggable (e) {
        this.$V.dom.setAttribute('draggable', true)
    }

    doMakeUndraggable (e) {
        this.$V.dom.removeAttribute('draggable')
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

createAdapter({
    implements: IListRowContainerWidget,
    adapts: interfaces.IListField,
    Component: ListRowContainerWidget,
}).registerWith(globalRegistry)

function renderRows ({ field, value, lang, disableI18n, namespace, inputName, itemKeys, validationErrors, customWidgets, onInput, onChange, onDelete, isMounted }) {
  if (value === undefined) return

  return value.map((item, index) => {
    const valueType = field.valueType
    const validationError = safeGet(() => validationErrors.errors[index])

    // Support readOnly
    // Support validation constraints    
    const myNamespace = namespace.slice()
    myNamespace.push(itemKeys[index].key)

    const { InputFieldAdapter, RowAdapter } = getWidgetAdapters(valueType, myNamespace.join('.'), customWidgets)

    const InputField = InputFieldAdapter.Component
    const Row = RowAdapter.Component

    // We need to know if this should be animated
    const justAdded = itemKeys[index].justAdded
    itemKeys[index].justAdded = false

    const newInputName = (inputName && index ? inputName + '[' + index + ']' : inputName || index)

    const ListRowContainer = globalRegistry.getAdapter(field, IListRowContainerWidget).Component

    return (
      <ListRowContainer className="InfernoFormlib-DragItem" key={myNamespace.join('.')} data-drag-index={index} isFirstMount={!isMounted} onDelete={() => onDelete(index)}>
        <Row adapter={RowAdapter} namespace={myNamespace} value={value[index]} validationError={validationError} formIsMounted={!justAdded} options={{lang, disableI18n}}>
            <InputField
                adapter={InputFieldAdapter}
                namespace={myNamespace}
                inputName={newInputName}
                propName={index}
                value={value[index]}
                validationError={validationError}
                options={{parentValue: value, lang, disableI18n}}
                formIsMounted={!justAdded}
                customWidgets={customWidgets}

                onInput={onInput}
                onChange={onChange} />
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

export class ListFieldWidget extends Component {

  constructor (props) {
    super(props)

    // Perhaps we should do a capability test and throw an error if not array like
    if (props.value && !(props.value instanceof Array)) throw new Error('Value passed to ListFieldWidget is not an array')

    const keys = {}

    this.keysNext = 0
    this.keys = []
    // Initialise keys for passed array if any
    // Making this test less strict to support Mobx Arrays:
    if (props.value instanceof Array) {
        for (var i = 0; i < props.value.length; i++) {
            this.keys.push({ key: this.keysNext, justAdded: false })
            this.keysNext++
        }
    }

    this.didInput = this.didInput.bind(this)
    this.didUpdate = this.didUpdate.bind(this)
    this.doAddRow = this.doAddRow.bind(this)
    this.doDeleteRow = this.doDeleteRow.bind(this)
    this.didDrop = this.didDrop.bind(this)

    this.handleDragStart = handleDragStart.bind(this)
    this.handleDragOver = handleDragOver.bind(this)
    this.handleDragEnter = handleDragEnter.bind(this)
    this.handleDragLeave = handleDragLeave.bind(this)
    this.handleDragEnd = handleDragEnd.bind(this)
    this.handleDrop = handleDrop.bind(this)
  }

  componentDidMount () {
    let domEl = this.$V.dom
    domEl.addEventListener('dragstart', this.handleDragStart, false)
    domEl.addEventListener('dragover', this.handleDragOver, false)
    domEl.addEventListener('dragenter', this.handleDragEnter, false)
    domEl.addEventListener('dragleave', this.handleDragLeave, false)
    domEl.addEventListener('dragend', this.handleDragEnd, false)
    domEl.addEventListener('drop', this.handleDrop, false)
    this.listenersAdded = true
  }

  componentWillUnmount () {
    let domEl = this.$V.dom
    domEl.removeEventListener('dragstart', this.handleDragStart, false)
    domEl.removeEventListener('dragover', this.handleDragOver, false)
    domEl.removeEventListener('dragenter', this.handleDragEnter, false)
    domEl.removeEventListener('dragleave', this.handleDragLeave, false)
    domEl.removeEventListener('dragend', this.handleDragEnd, false)
    domEl.removeEventListener('drop', this.handleDrop, false)
  }

  componentWillReceiveProps (nextProps) {
    // Because this is a container we set isMounted here instead of getting it from parent
    this.isMounted = true

    // Making this test less strict to support Mobx Arrays:
    if (!(nextProps.value instanceof Array) || nextProps.value.length < this.keys.length) {
        // We got undefined or fewer values than previously, need to shorten the keys array
        this.keys.splice(safeGet(() => nextProps.value.length, 0))
        return
    }

    // New array is larger so need to add som keys
    for (var i = this.keys.length; i < nextProps.value.length; i++) {
        this.keys.push({ key: this.keysNext, justAdded: true })
        this.keysNext++
    }
  }

  didInput (propName, data) {
    const value = this.props.value || {}
    value[propName] = data
    this.props.onInput && this.props.onInput(this.props.propName, value)
  }

  didUpdate (propName, data) {
    const value = this.props.value
    value[propName] = data
    this.props.onChange(this.props.propName, value)
  }

  doAddRow (e) {
    e.preventDefault()
    const value = this.props.value || []
    value.push(undefined)
    this.props.onChange(this.props.propName, value)
  }

  doDeleteRow (index) {
    const value = this.props.value
    const removedVal = value.splice(index, 1)
    const removedKey = this.keys.splice(index, 1)

    this.props.onChange(this.props.propName, value)
  }

  // TODO: This should probably be removed
  didDrop (source, targetIndex) {
    const value = this.props.value
    let sourceKey
    let sourceObj

    if (typeof source === 'object') {
        sourceObj = source
        sourceKey = { key: this.keysNext, justAdded: true }
        this.keysNext++
    } else {
        const sourceIndex = source
        sourceObj = value.splice(sourceIndex, 1)[0]
        sourceKey = this.keys.splice(sourceIndex, 1)[0]
        if (sourceIndex < targetIndex) {
            targetIndex--
        }
    }

    value.splice(targetIndex, 0, sourceObj)
    this.keys.splice(targetIndex, 0, sourceKey)
    this.props.onChange(this.props.propName, value)
  }

  render({inputName, namespace, options}) {
    const field = this.props.adapter.context
    const emptyArray = this.props.value === undefined || this.props.value.length === 0
    return <div id={generateId(this.props.namespace, '__Field')} className="InfernoFormlib-ListField InfernoFormlib-DragContainer">
        {emptyArray && field.placeholder && <ListFieldRow key="placeholder" isFirstMount={!this.props.formIsMounted}><Placeholder text={renderString(field.placeholder, undefined, undefined, this.props.options && this.props.options.disableI18n)} /></ListFieldRow>}
        {renderRows({
            lang: this.props.options.lang,
            disableI18n: this.props.options && this.props.options.disableI18n,
            field: field,
            value: this.props.value,
            namespace: this.props.namespace || [],
            inputName: this.props.inputName,
            itemKeys: this.keys,
            validationErrors: this.props.validationError,
            customWidgets: this.props.customWidgets,
            onInput: this.didInput,
            onChange: this.didUpdate,
            onDelete: this.doDeleteRow,
            isMounted: this.isMounted
        })}
        <div className="InfernoFormlib-ListFieldActionBar">
            <input type="button" className="btn btn-primary" value="Lägg till" onClick={this.doAddRow} />
        </div>
    </div>
  }
}

export default ListFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IListField,
    Component: ListFieldWidget,
}).registerWith(globalRegistry)
