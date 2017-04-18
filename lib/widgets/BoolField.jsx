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

class CheckboxWidget extends Component {

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-BoolField": true,
            "InfernoFormlib-BoolField--readonly": field.readOnly
        }

        return <input className={classNames(cls)} type="checkbox" readonly={field.readOnly && 'true'} value={this.props.value ? 'checked' : undefined} 
                    onChange={
                        (e) => {
                            this.props.onChange(this.props.propName, e.target.checked)
                        }
                    } />
    }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IBoolField,
    Component: CheckboxWidget
}).registerWith(globalRegistry)
