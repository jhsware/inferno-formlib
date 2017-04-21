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

class TextAreaWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            value: props.value
        }
        this.didGetInput = this.didGetInput.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetInput (e) {
        const field = this.props.adapter.context
        this.setState({
            value: field.fromString(e.target.value)
        })
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-TextAreaField": true,
            "InfernoFormlib-TextAreaField--readonly": field.readOnly
        }

        return <textarea className={classNames(cls)} type="text" placeholder={field.placeholder} readonly={field.readOnly && 'true'} value={this.state.value} 
                    onChange={
                        (e) => {
                            this.props.onChange(this.props.propName, this.state.value)
                        }
                    } onInput={this.didGetInput} />
    }
}

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ITextAreaField,
    Component: TextAreaWidget,
}).registerWith(globalRegistry)
