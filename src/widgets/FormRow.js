'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IFormRowWidget }  from '../interfaces'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import { renderString } from './common'

import FormGroup from 'inferno-bootstrap/lib/Form/FormGroup'
import _bs_Label from 'inferno-bootstrap/lib/Form/Label'

import { ErrorMsg, HelpMsg, unpackInvariantErrors, Label} from '../FormRowHelpers'

/*
    PROPS:
    - animation: animation css class prefix
    - submitted: bool, has been submitted
    - field:  isomorphic-schema field validator object
    - errors: isomorphic-schema field and server error object { fieldErrors, serverErrors } or undefined if no errors
    - id:     unique id of field
*/
class Row extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(this.$LI.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$LI.dom, 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, id}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup id={this.props.namespace.join('.') + '__Row'}>
            {field.label && <Label id={id} options={options}>{field.label}</Label>}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            <HelpMsg text={field.help} required={field._isRequired} options={options} />
        </FormGroup>
    }
}

createAdapter({
    implements: IFormRowWidget,
    adapts: interfaces.IBaseField,
    
    Component: Row,
    doesNotRenderLabel: function () { 
        return this.context.label ? false : true 
    }
}).registerWith(globalRegistry)


class ObjectRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(this.$LI.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$LI.dom, 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, id}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ObjectRow">
            {field.label && <Label id={id} options={options}>{field.label}</Label>}
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            {field.help ? <HelpMsg text={field.help} required={field._isRequired} options={options} /> : null}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
        </FormGroup>
    }
}

createAdapter({
    implements: IFormRowWidget,
    adapts: interfaces.IObjectField,
    
    Component: ObjectRow,
    doesNotRenderLabel: function () { 
        return this.context.label ? false : true 
    }
}).registerWith(globalRegistry)

class ListRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(this.$LI.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$LI.dom, 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, id}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ListRow">
            {field.label && <Label id={id} options={options}>{field.label}</Label>}
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            {field.help ? <HelpMsg text={field.help} required={field._isRequired} options={options} /> : null}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
        </FormGroup>
    }
}

createAdapter({
    implements: IFormRowWidget,
    adapts: interfaces.IListField,
    
    Component: ListRow,
    doesNotRenderLabel: function () { 
        return this.context.label ? false : true 
    }
}).registerWith(globalRegistry)


class CheckboxRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(this.$LI.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$LI.dom, 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, id}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return (
            <FormGroup id={this.props.namespace.join('.') + '__Row'} check>
                <div className="InfernoFormlib-RowFieldContainer">
                    <_bs_Label id={id} check>
                        {children}
                        {renderString(field.label, options && options.lang)}
                    </_bs_Label>
                </div>
                {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
                {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
                <HelpMsg text={field.help} required={field._isRequired} options={options} />
            </FormGroup>
        )
    }
}

createAdapter({
    implements: IFormRowWidget,
    adapts: interfaces.IBoolField,
    
    Component: CheckboxRow,
    doesNotRenderLabel: function () { 
        return this.context.label ? false : true 
    }
}).registerWith(globalRegistry)

export { CheckboxRow, ObjectRow, Row }