'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import classNames from 'classnames'

import Input from 'inferno-bootstrap/lib/Form/Input'
import { renderString } from './common'

// Placeholder

class CheckboxWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isChecked: props.value
        }

        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.state.isChecked) {
            this.setState({
                isChecked: nextProps.value
            })
        }
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.isChecked ? false : true)
    }

    render () {
        const field = this.props.adapter.context

        const isValid = this.props.validationError ? false : undefined

        return <Input type="checkbox"
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            valid={isValid}
            placeholder={renderString(field.placeholder)}
            readOnly={field.readOnly}
            checked={this.state.isChecked} // This is a checkbox and it should pass value as checked
            onChange={this.didGetChange} />
    }
}

export default CheckboxWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IBoolField,
    Component: CheckboxWidget
}).registerWith(globalRegistry)
