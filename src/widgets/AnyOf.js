'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { Adapter } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import classNames from 'classnames'

import { Input } from 'inferno-bootstrap'
import { renderString } from './common'
import { generateId } from './utils'

// Placeholder

class AnyOf extends Component {
    constructor (props) {
        super(props)

        this.state = {
            value: this.props.value
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

            aria-label={ inputName || 'text'}
            aria-invalid={isValid}

            onInput={this.didGetInput}
            onChange={this.didGetChange} />
    }
}

export default AnyOf

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IAnyOf,
    Component: AnyOf
})
