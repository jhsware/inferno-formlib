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
        this.props.onChange(this.props.propName, field.fromString(e.target.value))
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError ? false : undefined

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}
            readOnly={field.readOnly && 'true'}
            value={this.props.value}
            valid={isValid}
            
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder, options && options.lang, undefined, options && options.disableI18n)}</option>}
            {Array.isArray(field.options) && field.options.map((item) => <option value={item.name}>{renderString(item.title, options && options.lang, undefined, options && options.disableI18n)}</option>)}
        </Input>
    }
}

export default SelectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ISelectField,
    Component: SelectFieldWidget,
}).registerWith(globalRegistry)