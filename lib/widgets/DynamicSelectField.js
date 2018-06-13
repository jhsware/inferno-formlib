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
import { renderString } from './common'
import { generateId } from './utils'

import Input from 'inferno-bootstrap/lib/Form/Input'

// Placeholder

// Placeholder

class DynamicSelectFieldWidget extends Component {
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

        const selectOptions = field.getOptions(this.props.value, options)

        const isValid = this.props.validationError ? false : undefined

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}
            valid={isValid}
            readOnly={field.readOnly}
            value={this.props.value}
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder)}</option>}
            {selectOptions.map((item) => <option value={item.name}>{item.title}</option>)}
        </Input>
    }
}

export default DynamicSelectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDynamicSelectBaseField,
    Component: DynamicSelectFieldWidget,
}).registerWith(globalRegistry)