'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { Adapter } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget } from '../interfaces'
import { renderString } from './common'
import { generateId } from './utils'

import { Input } from 'inferno-bootstrap'

// Placeholder

class InputWidget extends Component {
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
        // Trigger change so FormRow can update character counter
        this.props.onChange(this.props.propName, newVal)

    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined

        return <Input
            id={generateId(namespace, '__Field')}
            name={inputName}
            valid={isValid}
            placeholder={renderString(field.placeholder, options && options.lang)}
            readOnly={field.readOnly}
            value={field.toFormattedString(this.state.value)}

            onInput={this.didGetInput}
            onChange={this.didGetChange} />
    }
}

export default InputWidget

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ITextField,
    Component: InputWidget
})

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IIntegerField,
    Component: InputWidget
})

class DecimalWidget extends InputWidget {
    didGetInput (e) {
        const field = this.props.adapter.context
        const inp = e.target.value

        // Preserve content in input box if ending with decimal and not has any previous decimal
        if (typeof inp === 'string' && inp[inp.length - 1] === '.' && inp.match(/\./g).length === 1) {
            return this.setState({
                value: inp
            });
        }
        
        const newVal = field.fromString(e.target.value)
        this.setState({
            value: newVal
        })
        // Trigger change so FormRow can update character counter
        this.props.onChange(this.props.propName, newVal)
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined
        const value = (this.state.value === undefined || this.state.value === null ? '' : field.toFormattedString(this.state.value))

        return <Input
            id={generateId(namespace, '__Field')}
            name={inputName}
            valid={isValid}
            placeholder={renderString(field.placeholder, options && options.lang)}
            readOnly={field.readOnly}
            value={value}

            onInput={this.didGetInput}
            onChange={this.didGetChange} />
    }
}

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDecimalField,
    Component: DecimalWidget
})
