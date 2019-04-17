'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import { renderString } from './common'
import { generateId } from './utils'

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
            values.push(field.fromString(field.valueType.fromString(selectedOptions[i].value)))
        }
        this.props.onChange(this.props.propName, values)
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}

            aria-label={ inputName || 'select'}
            aria-invalid={isValid}
            
            multiple="true"
            readOnly={field.readOnly}
            value={field.valueType.toFormattedString(field.toFormattedString(this.props.value))}
            valid={isValid}
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder, options && options.lang)}</option>}
            {Array.isArray(field.options) && field.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </Input>
    }
}

export default MultiSelectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IMultiSelectField,
    Component: MultiSelectFieldWidget,
}).registerWith(globalRegistry)