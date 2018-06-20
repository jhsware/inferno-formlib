'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry or include as a custom field.

        createAdapter({
            implements: IInputFieldWidget,
            adapts: IYourCustomField,
            Component: AutoCompleteBaseWidget,
        }).registerWith(globalRegistry)

    or

        <CustomWidget propPath='customPropName' fieldWidget={AutoCompleteWidget} />

*/
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import classnames from 'classnames'

import Input from 'inferno-bootstrap/lib/Form/Input'
import Dropdown from 'inferno-bootstrap/lib/Dropdown'
import DropdownMenu from 'inferno-bootstrap/lib/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/lib/DropdownItem'
import { Target } from 'inferno-popper'

import {renderString} from './common'
import { generateId, throttle } from './utils'

// Placeholder

class AutocompleteItem extends Component {
    constructor (props) {
        super(props)
        this.didClick = this.didClick.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.isMarked && !this.props.isMarked) {
            // Check if it is visible
            const domNode = this.$V.dom
            const currBottom = domNode.offsetTop + domNode.offsetHeight
            if (currBottom > (domNode.parentNode.offsetHeight + domNode.parentNode.scrollTop)) {
              domNode.parentNode.scrollTop = currBottom - domNode.parentNode.offsetHeight
            } else if (domNode.offsetTop < domNode.parentNode.scrollTop) {
              domNode.parentNode.scrollTop = domNode.offsetTop
            }
        }
    }

    componentDidMount () {
        animateOnAdd(this.$V.dom, 'InfernoFormlib-AutocompleteItem--Animation')
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-AutocompleteItem--Animation')
    }

    didClick (e) {
      e.preventDefault()
      this.props.onSelect(this.props.value)
    }

    render () {
        let cls = {
            'InfernoFormlib-AutocompleteItem': true,
            'InfernoFormlib-AutocompleteItem--Highlight': this.props.isMarked
        }
        return <DropdownItem className={classnames(cls)} onClick={this.didClick}>{this.props.value.title}</DropdownItem>
    }
}

function _getOptionsAsync (value, options, context) {
    const currentMarked = this.state.options[this.state.markAtIndex]

    return this.props.adapter.context.getOptionsAsync(value, options, context)
        .then((results) => {
            // Maintain selection when updating list if possible
            const markAtIndex = currentMarked && results.reduce((curr, next, index) => curr === undefined && next.name === currentMarked.name ? index : curr, undefined)

            return {
                options: results,
                isOpen: true,
                markAtIndex: markAtIndex || 0 // Default to select top most option
            }
        })
        .catch(() => {
            return {
                options: [{ name: value, title: 'Fel när data laddades...'}],
                isOpen: true,
                markAtIndex: undefined
            }       
        })
}

function TypeAhead (props) {
    if (!props.markedValue) {
        return null
    } else {
        const text = props.text
        const suffix = (
            props.markedValue.title.toLowerCase().indexOf(text.toLowerCase()) === 0 ?
            props.markedValue.title.substr(text.length) :
            ''
        )

        return (
            <div className="InfernoFormlib-AutoComplete-TypeAhead">
                <span className="InfernoFormlib-AutoComplete-TypeAheadPrefix">{text}</span>
                <span className="InfernoFormlib-AutoComplete-TypeAheadSuffix">{suffix}</span>
            </div>
        )
    }
}

const _actionKeys = {
    ArrowDown: true,
    ArrowUp: true,
    Enter: true
}

class AutoCompleteBaseWidget extends Component {
    constructor (props) {
        super(props)

        const field = this.props.adapter.context
        
        // Throttle API-calls (ms)
        this._throttleTimeout = 300

        this.state = {
            text: props.value && this.toText(field.toFormattedString(props.value)),
            isOpen: false,
            options: [],
            markAtIndex: undefined
        }

        this.didGetHotKey = this.didGetHotKey.bind(this)
        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
        this.didSelect = this.didSelect.bind(this)
        this.doToggle = this.doToggle.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        // TODO: How do we supply these because they could be used to get options
        const options = undefined
        const context = undefined

        const field = this.props.adapter.context

        this.setState({
            text: nextProps.value && this.toText(field.toFormattedString(nextProps.value)),
            value: nextProps.value
        })
    }

    toText (value) {
        return value && value.title
    }

    componentDidMount () {
        document.addEventListener('keydown', this.didGetHotKey, false)
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.didGetHotKey)
    }

    doToggle (e) {
        e && e.preventDefault()
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    didGetHotKey (e) {
        // Use for navigation and enter only!
        console.log('DID PRESS: ' + e)
        if (_actionKeys[e.key] && this.state.markAtIndex !== undefined) {
            // So we got a hotkey
            const domEl = this._inputNode.$V.dom
            if (domEl === e.target) {
                // And it was fired in our input box
                if (e.key === 'ArrowUp') {
                    this.setState({
                        markAtIndex: this.state.markAtIndex <= 0 ? this.state.options.length - 1 : this.state.markAtIndex - 1
                    })
                    e.preventDefault()
                } else if (e.key === 'ArrowDown') {
                    this.setState({
                        markAtIndex: this.state.markAtIndex >= (this.state.options.length - 1) ? 0 : this.state.markAtIndex + 1
                    })
                    e.preventDefault()
                } else if (e.key === 'Enter') {
                    if (this.state.markAtIndex !== undefined) {
                        this.didSelect(this.state.options[this.state.markAtIndex])
                    }
                    e.preventDefault()
                }
            }
        }
    }

    didGetInput (e) {
        // TODO: How do we supply these because they could be used to get options
        const options = {
            search: e.target.value
        }

        if (e.target.value !== this.state.text && e.target.value.length > 1) {
            const __timerName__ = '_optionsTimer'
            throttle.call(this, this._throttleTimeout, __timerName__).then((timer) => {
                const context = undefined
                _getOptionsAsync.call(this, undefined, options, context).then((res) => {
                    // Only setState if this is the latest executing timer
                    if (this[__timerName__] === timer) {
                        this.setState(res)
                    }
                })
            })
        }

        this.setState({
            text: e.target.value,
            markAtIndex: e.target.value ? this.state.markAtIndex : undefined
        })
    }

    didGetChange (e) {
        // Not doing anything for now
    }

    didSelect (value) {
      const field = this.props.adapter.context
      this.setState({
          options: [],
          isOpen: false,
          markAtIndex: undefined
      })
      this.props.onChange(this.props.propName, field.fromString(value))
      
      // Blur focus to emphasize that selection has been done
      this._inputNode.$V.dom.blur()
    }

    renderInput ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const cls = {
            "form-control": true,
            "form-control-danger": this.props.validationError
        }

        return (
            <Input type="text"
                ref={(node) => this._inputNode = node}
                id={generateId(namespace, '__Field')}
                name={inputName}
                className={classnames(cls)}
                autocomplete="off"
                placeholder={renderString(field.placeholder, options && options.lang, undefined, options && options.disableI18n)}
                readOnly={field.readOnly}
                value={this.state.text}

                onChange={this.didGetChange}
                onInput={this.didGetInput} />
        )
    }

    renderTypeAhead () {
        if (this.state.text) {
            return <TypeAhead text={this.state.text} markedValue={this.state.options[this.state.markAtIndex]} />            
        }
    }

    renderDropdownMenu () {
        // Only show options if we have entered text
        const options = this.state.text ? this.state.options : []

        return (
            <DropdownMenu className="InfernoFormlib-AutoCompleteItemContainer">
                {options.map((item, index) => <AutocompleteItem key={index} value={item} isMarked={index === this.state.markAtIndex} onSelect={this.didSelect} />)}
            </DropdownMenu>
        )
    }

    render (props) {
        return (
            <Dropdown className="InfernoFormlib-AutoCompleteField" isOpen={this.state.isOpen} toggle={this.doToggle}>
                <Target>
                    {this.renderInput(props)}
                    {this.renderTypeAhead()}
                </Target>
                {this.renderDropdownMenu()}
            </Dropdown>
        )
    }
}

export default AutoCompleteBaseWidget
