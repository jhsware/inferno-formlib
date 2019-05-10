'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Adapter } from 'component-registry'

import { Component } from 'inferno'
import { findDOMNode } from 'inferno-extras'
import { safeGet } from 'safe-utils'

import { renderString } from './common'
import { i18n } from 'isomorphic-schema'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import { generateId } from './utils'

import {
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDrop
} from '../draggable'

import {
    Placeholder,
    renderRows
} from './ListFieldHelpers'


export default class ListFieldWidget extends Component {

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
    let domEl = findDOMNode(this)
    domEl.addEventListener('dragstart', this.handleDragStart, false)
    domEl.addEventListener('dragover', this.handleDragOver, false)
    domEl.addEventListener('dragenter', this.handleDragEnter, false)
    domEl.addEventListener('dragleave', this.handleDragLeave, false)
    domEl.addEventListener('dragend', this.handleDragEnd, false)
    domEl.addEventListener('drop', this.handleDrop, false)
    this.listenersAdded = true
  }

  componentWillUnmount () {
    let domEl = findDOMNode(this)
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
    // Adding this because in some cases the event will keep on calling this event handler.
    // Could be due to propagation.
    e.stopPropagation()
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

  renderAddButton ({ adapter, value, options }) {
    const field = adapter.context
    const nrofItems = (Array.isArray(value) && value.length) || 0
    
    // Respect maxLength
    if (field.maxLength <= nrofItems) return null

    return (
        <div className="InfernoFormlib-ListFieldActionBar">
            <input
              type="button"
              className="btn btn-primary"
              value={renderString(i18n('inferno-formlib--ListField_add', 'Add'), options && options.lang, 'Add')}
              onClick={this.doAddRow} />
        </div>
    )
  }

  render({adapter, value, namespace, options}) {
    const field = adapter.context
    const emptyArray = value === undefined || value.length === 0
    return <div id={generateId(namespace, '__Field')} className="InfernoFormlib-ListField InfernoFormlib-DragContainer">
        {emptyArray && field.placeholder && <ListFieldRow key="placeholder" isFirstMount={!this.props.formIsMounted}><Placeholder text={renderString(field.placeholder)} /></ListFieldRow>}
        {renderRows({
            lang: options.lang,
            
            field: field,
            value: value,
            namespace: namespace || [],
            inputName: this.props.inputName,
            itemKeys: this.keys,
            validationErrors: this.props.validationError,
            customWidgets: this.props.customWidgets,
            onInput: this.didInput,
            onChange: this.didUpdate,
            onDelete: this.doDeleteRow,
            isMounted: this.isMounted
        })}
        {this.renderAddButton({adapter, value, options})}
    </div>
  }
}

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IListField,
    Component: ListFieldWidget,
})
