'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

import { createAdapter, globalRegistry } from 'component-registry'
import { renderString } from './common'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'

import Input from 'inferno-bootstrap/lib/Form/Input'

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
        this.setState({
            value: field.fromString(e.target.value)
        })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    render () {
        const field = this.props.adapter.context

        const state = this.props.validationError ? 'danger' : undefined

        return <Input type="password"
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            placeholder={renderString(field.placeholder)}
            readOnly={field.readOnly}
            value={this.state.value}
            state={state}
            onChange={this.didGetChange}
            onInput={this.didGetInput} />
    }
}

export default PassworWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IPasswordField,
    Component: PassworWidget
}).registerWith(globalRegistry)
