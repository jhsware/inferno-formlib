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

class DynamicSelectFieldWidget extends Component {
    constructor (props) {
        super(props)

        this.didGetChange = this.didGetChange.bind(this)
    }

    didGetChange (e) {
        const field = this.props.adapter.context
        this.props.onChange(this.props.propName, field.fromString(field.valueType.fromString(e.target.value)))
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const selectOptions = field.getOptions(this.props.value, Object.assign({ rootValue: this.context.rootValue }, options))

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined
        const { lang } = options

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}
            valid={isValid}
            readOnly={field.readOnly}
            value={field.valueType.toFormattedString(field.toFormattedString(this.props.value))}
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder, lang, undefined)}</option>}
            {selectOptions.map((item) => <option value={item.name}>{renderString(item.title, lang, undefined)}</option>)}
        </Input>
    }
}

export default DynamicSelectFieldWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDynamicSelectBaseField,
    Component: DynamicSelectFieldWidget,
}).registerWith(globalRegistry)