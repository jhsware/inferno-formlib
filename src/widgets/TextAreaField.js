'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'
import { renderString } from './common'
import { generateId } from './utils'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'

import Input from 'inferno-bootstrap/lib/Form/Input'

// Placeholder

class TextAreaWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            value: props.value
        }

        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetInput (e) {
        const field = this.props.adapter.context
        const newVal = field.fromString(e.target.value)
        this.setState({
            value: newVal
        })
        // Trigger change so FormRow can update character counter
        this.props.onChange(this.props.propName, newVal)

    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    render ({inputName, namespace, options, doesNotRenderLabel, id}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined

        const ariaLabels = {
            'aria-invalid': isValid !== undefined,
            'aria-labelledby': doesNotRenderLabel ? undefined : id,
            'aria-label': doesNotRenderLabel ? renderString(field.label || 'inferno-formlib--InputField', options && options.lang, 'TextArea Field') : undefined,
            'aria-required': field._isRequired ? field._isRequired : undefined
        }

        return <Input type="textarea"
            id={generateId(namespace, '__Field')}
            name={inputName}
            placeholder={renderString(field.placeholder, options && options.lang)}
            readOnly={field.readOnly}
            value={this.state.value}
            valid={isValid}

            {...ariaLabels}
            
            onInput={this.didGetInput}
            onChange={this.didGetChange} />
    }
}

export default TextAreaWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ITextAreaField,
    Component: TextAreaWidget,
}).registerWith(globalRegistry)
