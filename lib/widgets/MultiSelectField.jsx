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

class MultiSelectFieldWidget extends Component {

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-MultiSelectField": true,
            "InfernoFormlib-MultiSelectField--readonly": field.readOnly
        }

        return <select className={classNames(cls)} type="text" multiple="true" readonly={field.readOnly && 'true'} value={this.props.value} 
                    onChange={
                        (e) => {
                            const selectedOptions = e.target.selectedOptions
                            const values = []
                            for (var i = 0; i < selectedOptions.length; i++) {
                                values.push(field.fromString(selectedOptions[i].value))
                            }
                            this.props.onChange(this.props.propName, values)
                        }
                    }>
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </select>
    }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IMultiSelectField,
    Component: MultiSelectFieldWidget,
}).registerWith(globalRegistry)