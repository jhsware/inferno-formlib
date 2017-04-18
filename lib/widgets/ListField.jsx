'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import Inferno from 'inferno'
import Component from 'inferno-component'

import { animateOnAdd, animateOnRemove } from '../animated.jsx'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget, IFormRowWidget }  from '../interfaces'

class ListFieldRow extends Component {
    componentDidMount () {
        animateOnAdd(this, 'InfernoFormlib-ListFieldRow--Animation')
    }

    componentWillUnmount () {
        animateOnRemove(this, 'InfernoFormlib-ListFieldRow--Animation')
    }

    render () {
        return <div className="InfernoFormlib-ListFieldRow">
            {this.props.children}
        </div>
    }
}

function renderRows (field, value, keyObj, errors, onChange, onDelete) {
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
    let key
    const tmpKeys = Object.keys(keyObj)
    for (var i = 0; i < tmpKeys.length; i++) {
        if (keyObj[tmpKeys[i]] === item) {
            key = tmpKeys[i]
            break
        }
    }

    return (
      <ListFieldRow key={index}>
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

function _getKey(keyObj, item) {

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
            keys[index] = item
        })
    }
    this.state = {
        keys: keys,
        keyCounter: Object.keys(keys).length
    }

    this.didUpdate = this.didUpdate.bind(this)
    this.doAddRow = this.doAddRow.bind(this)
    this.doDeleteRow = this.doDeleteRow.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!Array.isArray(nextProps.value)) return
    
    let tmpList = nextProps.value.slice()
    const matchedKeys = {}
    Object.keys(this.state['keys']).forEach((key) => {
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
    let tmpKeys = this.state.keys
    Object.keys(tmpKeys).forEach((key) => {
        if (!matchedKeys[key]) delete tmpKeys[key]
    })
    // Add keys for remaining items in tmpList
    let keyCounter = this.state.keyCounter
    tmpList.forEach((item) => {
        tmpKeys[keyCounter] = item
        keyCounter++
    })
    this.setState({
        keys: tmpKeys,
        keyCounter: keyCounter
    })
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
    value.splice(index, 1)
    this.props.onChange(this.props.propName, value)
  }

  render() {
    const field = this.props.adapter.context
    const emptyArray = this.props.value === undefined || this.props.value.length === 0
    return <div className="InfernoFormlib-ListField">
        {emptyArray && field.placeholder && <ListFieldRow key="placeholder"><Placeholder text={field.placeholder} /></ListFieldRow>}
        {renderRows(field, this.props.value, this.state.keys, this.props.validationError, this.didUpdate, this.doDeleteRow)}
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
