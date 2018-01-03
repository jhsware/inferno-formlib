'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { createAdapter, globalRegistry } from 'component-registry'

import Inferno from 'inferno'
import Component from 'inferno-component'
import { safeGet } from 'safe-utils'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import getWidgetAdapters from '../getWidgetAdapters'

import Button from 'inferno-bootstrap/lib/Button'

import { handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDragEnd, handleDrop } from '../draggable.jsx'

class ListFieldRow extends Component {
    componentDidMount () {
        if (!this.props.isFirstMount) {
            animateOnAdd(this, 'InfernoFormlib-ListFieldRow--Animation')
        }

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
        return <div className={"InfernoFormlib-ListFieldRow" + (this.props.className ? ' ' + this.props.className : '')} data-drag-index={this.props['data-drag-index']}>
            {this.props.children}
        </div>
    }
}

function renderRows ({ field, value, lang, namespace, inputName, itemKeys, validationErrors, customWidgets, onChange, onDelete, onDrop, isMounted }) {
  if (value === undefined) return

  return value.map((item, index) => {
    const valueType = field.valueType
    const validationError = safeGet(() => validationErrors.fieldErrors[index])

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

    return (
      <ListFieldRow className="InfernoFormlib-DragItem" key={myNamespace.join('.')} data-drag-index={index} onDrop={onDrop} isFirstMount={!isMounted}>
        <div className="InfernoFormlib-DragHandle" draggable="true"></div>

        <Row adapter={RowAdapter} namespace={myNamespace} validationError={validationError} formIsMounted={!justAdded} options={{lang: lang}}>
            <InputField
                adapter={InputFieldAdapter}
                namespace={myNamespace}
                inputName={newInputName}
                propName={index}
                value={value[index]}
                options={{parentValue: value, lang: lang}}
                formIsMounted={!justAdded}
                customWidgets={customWidgets}

                onChange={onChange} />
        </Row>
        <Button className="InfernoFormlib-ListFieldRowDeleteBtn"
            color="danger"
            onClick={(e) => {
                e.preventDefault()
                onDelete(index)
            }}>Ta bort</Button>
      </ListFieldRow>
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

    const keys = {}

    this.keysNext = 0
    this.keys = []
    // Initialise keys for passed array if any
    if (Array.isArray(props.value)) {
        for (var i = 0; i < props.value.length; i++) {
            this.keys.push({ key: this.keysNext, justAdded: true })
            this.keysNext++
        }
    }

    this.didUpdate = this.didUpdate.bind(this)
    this.doAddRow = this.doAddRow.bind(this)
    this.doDeleteRow = this.doDeleteRow.bind(this)
    this.didDrop = this.didDrop.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Because this is a container we set isMounted here instead of getting it from parent
    this.isMounted = true

    if (!Array.isArray(nextProps.value) || nextProps.value.length < this.keys.length) {
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

  didDrop (sourceIndex, targetIndex) {
    const value = this.props.value

    const source = value.splice(sourceIndex, 1)[0]
    const sourceKey = this.keys.splice(sourceIndex, 1)[0]
    if (sourceIndex < targetIndex) {
        targetIndex--
    }
    value.splice(targetIndex, 0, source)
    this.keys.splice(targetIndex, 0, sourceKey)

    this.props.onChange(this.props.propName, value)
  }

  render() {
    const field = this.props.adapter.context
    const emptyArray = this.props.value === undefined || this.props.value.length === 0
    return <div id={this.props.namespace.join(".") + "__Field"} className="InfernoFormlib-ListField InfernoFormlib-DragContainer">
        {emptyArray && field.placeholder && <ListFieldRow key="placeholder" isFirstMount={!this.props.formIsMounted}><Placeholder text={field.placeholder} /></ListFieldRow>}
        {renderRows({
            lang: this.props.options.lang,
            field: field,
            value: this.props.value,
            namespace: this.props.namespace || [],
            inputName: this.props.inputName,
            itemKeys: this.keys,
            validationErrors: this.props.validationError,
            customWidgets: this.props.customWidgets,
            onChange: this.didUpdate,
            onDelete: this.doDeleteRow,
            onDrop: this.didDrop,
            isMounted: this.isMounted
        })}
        <div className="InfernoFormlib-ListFieldActionBar">
            <input type="button" value="Lägg till" onClick={this.doAddRow} />
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
