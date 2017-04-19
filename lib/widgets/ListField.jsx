'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import Inferno from 'inferno'
import Component from 'inferno-component'

import { animateOnAdd, animateOnRemove } from '../animated'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget, IFormRowWidget }  from '../interfaces'

import { handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDragEnd, handleDrop } from '../draggable'

class ListFieldRow extends Component {
    componentDidMount () {
        animateOnAdd(this, 'InfernoFormlib-ListFieldRow--Animation')

        if (!this.listenersAdded) {
            let domEl = this._vNode.dom
            domEl.addEventListener('dragstart', handleDragStart.bind(this), false)
            domEl.addEventListener('dragover', handleDragOver.bind(this), false)
            domEl.addEventListener('dragenter', handleDragEnter.bind(this), false)
            domEl.addEventListener('dragleave', handleDragLeave.bind(this), false)
            domEl.addEventListener('dragend', handleDragEnd.bind(this), false)
            domEl.addEventListener('drop', handleDrop.bind(this), false)
            this.listenersAdded = true
        }
    }

    componentWillUnmount () {
        animateOnRemove(this, 'InfernoFormlib-ListFieldRow--Animation')

        // TODO: Cleanup
        /*
        let domEl = this._vNode.dom
        domEl.removeEventListener('dragstart', handleDragStart.bind(this), false)
        domEl.removeEventListener('dragover', handleDragOver.bind(this), false)
        domEl.removeEventListener('dragenter', handleDragEnter.bind(this), false)
        domEl.removeEventListener('dragleave', handleDragLeave.bind(this), false)
        domEl.removeEventListener('dragend', handleDragEnd.bind(this), false)
        domEl.removeEventListener('drop', handleDrop.bind(this), false)
        */
    }

    render () {
        return <div className="InfernoFormlib-ListFieldRow InfernoFormlib-DragItem" data-drag-index={this.props['data-drag-index']} draggable="true">
            {this.props.children}
        </div>
    }
}

function renderRows (field, value, keyObj, errors, onChange, onDelete, onDrop) {
  if (value === undefined) return

  return value.map((item, index) => {
    const valueType = field.valueType
    const validationError = errors && errors.fieldErrors[index]
    // Support readOnly
    // Support validation constraints
    const InputFieldAdapter = globalRegistry.getAdapter(valueType, IInputFieldWidget)
    const RowAdapter = globalRegistry.getAdapter(valueType, IFormRowWidget)

    const Row = RowAdapter.Component
    const InputField = InputFieldAdapter.Component

    // Find the key for this item
    let key = _getKey(keyObj, item, index)

    return (
      <ListFieldRow key={key} data-drag-index={index} onDrop={onDrop}>
        <Row adapter={RowAdapter} validationError={validationError}>
            <InputField adapter={InputFieldAdapter} propName={index} value={value[index]} onChange={onChange} />
        </Row>
        <input className="InfernoFormlib-ListFieldRowDeleteBtn" type="button" onClick={(e) => {
            e.preventDefault()
            onDelete(index)
        }} value="Ta bort" />
      </ListFieldRow>
    )
  })
}

function _getKey(keyObj, item, index) {
    if (typeof item !== 'object') {
        // We only get reference pointers to objects
        return Object.keys(keyObj)[index]
    }
    let key
    const tmpKeys = Object.keys(keyObj)
    for (var i = 0; i < tmpKeys.length; i++) {
        if (keyObj[tmpKeys[i]] === item) {
            key = tmpKeys[i]
            break
        }
    }
    return key
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

    const keys = {}
    if (Array.isArray(props.value)) {
        props.value.forEach((item, index) => {
            keys[index + ''] = item
        })
    }
    this.state = {
        keys: keys,
        keyCounter: Object.keys(keys).length,
        value: this.props.value
    }

    this.didUpdate = this.didUpdate.bind(this)
    this.doAddRow = this.doAddRow.bind(this)
    this.doDeleteRow = this.doDeleteRow.bind(this)
    this.didDrop = this.didDrop.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!Array.isArray(nextProps.value)) return
    
    let tmpList = nextProps.value.slice()
    let nextKeys = {}
    // Check first item in list to determine if we should do a simple match
    // or proper object type check
    if (typeof tmpList[0] !== 'object') {
        // Only check length of list if we don't have objects
        const currentKeyObj = this.state['keys']
        const currentKeys = Object.keys(currentKeyObj)

        if (currentKeys.length > tmpList.length) {
            // Remove extra keys
            currentKeys.splice(tmpList.length)

            // And create next key object
            currentKeys.forEach((key) => {
                nextKeys[key] = currentKeyObj[key]
            })
        } else if (currentKeys.length <= tmpList.length) {
            tmpList.splice(0, currentKeys.length)
        }
        currentKeys.forEach((key) => {
            nextKeys[key] = currentKeyObj[key]
        })
    } else {
        // Match by object reference if we have a list of objects
        const matchedKeys = {}
        Object.keys(this.state['keys']).forEach((key, index) => {
            let matchObj = this.state['keys'][key]
            for (let i = 0; i < tmpList.length; i++) {
                if (matchObj === tmpList[i]) {
                    matchedKeys[key] = true
                    tmpList.splice(i, 1)
                    break
                }
            }
        })
        // Remove key references for items that don't exist any more so they get garbage collected
        nextKeys = this.state.keys
        Object.keys(nextKeys).forEach((key) => {
            if (!matchedKeys[key]) delete nextKeys[key]
        })
    }

    // Add keys for remaining items in tmpList if there are any
    let keyCounter = this.state.keyCounter
    tmpList.forEach((item) => {
        nextKeys[keyCounter + ''] = item
        keyCounter++
    })
    
    this.setState({
        keys: nextKeys,
        keyCounter: keyCounter,
        value: nextProps.value
    })
  }

  didUpdate (propName, data) {
    const value = this.props.value
    value[propName] = data
    this.setState({
        value: value
    })
    this.props.onChange(this.props.propName, value)
  }

  doAddRow (e) {
    e.preventDefault()
    const value = this.state.value || []
    value.push(undefined)
    this.props.onChange(this.props.propName, value)
  }

  doDeleteRow (index) {
    const value = this.props.value
    const removedVal = value.splice(index, 1)

    const keyObj = this.state.keys
    if (typeof removeVal !== 'object') {
        delete keyObj[Object.keys(keyObj)[index]]
    }
    this.setState({
        keys: keyObj,
        value: value
    })
    this.props.onChange(this.props.propName, value)
  }

  didDrop (sourceIndex, targetIndex) {
    const value = this.state.value
    const keys = Object.keys(this.state.keys)

    const source = value.splice(sourceIndex, 1)[0]
    const sourceKey = keys.splice(sourceIndex, 1)[0]
    if (sourceIndex < targetIndex) {
        targetIndex--
    }
    value.splice(targetIndex, 0, source)

    let newKeys = {}
    if (typeof source !== 'object') {
        keys.splice(targetIndex, 0, sourceKey)
        keys.forEach((key) => {
            newKeys[key] = this.state.keys[key]
        })
    } else {
        newKeys = this.state.keys
    }

    this.setState({
        keys: newKeys,
        value: value
    })
    this.props.onChange(this.props.propName, value)
  }

  render() {
    const field = this.props.adapter.context
    const emptyArray = this.state.value === undefined || this.state.value.length === 0
    console.log(Object.keys(this.state.keys))
    return <div className="InfernoFormlib-ListField InfernoFormlib-DragContainer">
        {emptyArray && field.placeholder && <ListFieldRow key="placeholder"><Placeholder text={field.placeholder} /></ListFieldRow>}
        {renderRows(field, this.state.value, this.state.keys, this.props.validationError, this.didUpdate, this.doDeleteRow, this.didDrop)}
        <div className="InfernoFormlib-ListFieldActionBar">
            <input type="button" value="Lägg till" onClick={this.doAddRow} />
        </div>
    </div>
  }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IListField,
    Component: ListFieldWidget,
}).registerWith(globalRegistry)
