'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

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

        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, e.target.checked)
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
            value={field.toFormattedString(this.state.value)}
            onChange={this.didGetChange}
            onInput={this.didGetInput} />
    }
}

export default CheckboxWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IBoolField,
    Component: CheckboxWidget
}).registerWith(globalRegistry)
