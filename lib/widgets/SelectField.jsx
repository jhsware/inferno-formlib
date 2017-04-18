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

// Placeholder

class SelectFieldWidget extends Component {

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-SelectField": true,
            "InfernoFormlib-SelectField--readonly": field.readOnly
        }

        return <select className={classNames(cls)} type="text" readonly={field.readOnly && 'true'} value={this.props.value} 
                    onChange={
                        (e) => {
                            this.props.onChange(this.props.propName, e.target.value)
                        }
                    }>
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </select>
    }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ISelectField,
    Component: SelectFieldWidget,
}).registerWith(globalRegistry)