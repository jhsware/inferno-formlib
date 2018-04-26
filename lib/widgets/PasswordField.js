'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'
import { renderString } from './common'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'

import Input from 'inferno-bootstrap/lib/Form/Input'
import { generateId } from './utils'

// Placeholder

class PassworWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            value: props.value
        }
        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetInput (e) {
        const field = this.props.adapter.context
        const newVal = field.fromString(e.target.value)
        this.setState({
            value: newVal
        })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    render () {
        const field = this.props.adapter.context

        const isValid = this.props.validationError ? false : undefined

        return <Input type="password"
            id={generateId(this.props.namespace, '__Field')}
            name={this.props.inputName}
            placeholder={renderString(field.placeholder)}
            readOnly={field.readOnly}
            value={this.state.value}
            valid={isValid}
            
            onInput={this.didGetInput}
            onChange={this.didGetChange} />
    }
}

export default PassworWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IPasswordField,
    Component: PassworWidget
}).registerWith(globalRegistry)
