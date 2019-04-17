'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { Adapter } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import { renderString } from './common'
import { generateId } from './utils'

import { Input } from 'inferno-bootstrap'

// Placeholder

class SelectFieldWidget extends Component {
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
        this.props.onChange(this.props.propName, field.fromString(field.valueType.fromString(e.target.value)))
    }

    render ({inputName, namespace, options, doesNotRenderLabel, id}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined
        const { lang } = options

        const ariaLabels = {
            'aria-invalid': isValid !== undefined,
            'aria-labelledby': doesNotRenderLabel ? undefined : id,
            'aria-label': doesNotRenderLabel ? renderString(field.label || 'inferno-formlib--InputField', options && options.lang, 'Select Field') : undefined,
            'aria-required': field._isRequired ? field._isRequired : undefined
        }

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}

            {...ariaLabels}
            
            readOnly={field.readOnly && 'true'}
            value={field.valueType.toFormattedString(field.toFormattedString(this.props.value))}
            valid={isValid}
            
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder, lang, undefined)}</option>}
            {Array.isArray(field.options) && field.options.map((item) => <option value={item.name}>{renderString(item.title, lang, undefined)}</option>)}
        </Input>
    }
}

export default SelectFieldWidget

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ISelectField,
    Component: SelectFieldWidget,
})