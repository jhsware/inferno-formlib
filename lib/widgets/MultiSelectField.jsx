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

import Input from 'inferno-bootstrap/lib/Form/Input'

// Placeholder

class MultiSelectFieldWidget extends Component {
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
        const field = this.props.adapter.context
        const selectedOptions = e.target.selectedOptions
        const values = []
        for (var i = 0; i < selectedOptions.length; i++) {
            values.push(field.fromString(selectedOptions[i].value))
        }
        this.props.onChange(this.props.propName, values)
    }

    render () {
        const field = this.props.adapter.context

        const state = this.props.validationError ? 'danger' : undefined

        return <Input type="select"
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            multiple="true"
            readOnly={field.readOnly}
            value={this.props.value}
            state={state}
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </Input>
    }
}

export default MultiSelectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IMultiSelectField,
    Component: MultiSelectFieldWidget,
}).registerWith(globalRegistry)