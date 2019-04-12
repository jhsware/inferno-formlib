'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { Adapter } from 'component-registry'
import { findDOMNode } from 'inferno-extras'
import { interfaces } from 'isomorphic-schema'
import { IFormRowWidget }  from '../interfaces'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import { renderString } from './common'

import {
    FormGroup,
    Label as _bs_Label
 } from 'inferno-bootstrap'

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
            animateOnAdd(findDOMNode(this), 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(findDOMNode(this), 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, _id}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup id={this.props.namespace.join('.') + '__Row'}>
            {field.label && <Label id={_id} options={options}>{field.label}</Label>}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            <HelpMsg text={field.help} required={field._isRequired && !validationError} options={options} />
        </FormGroup>
    }
}

new Adapter({
    implements: IFormRowWidget,
    adapts: interfaces.IBaseField,
    
    Component: Row,
    doesNotRenderLabel: false
})


class ObjectRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(findDOMNode(this), 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(findDOMNode(this), 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, _id}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ObjectRow">
            {field.label && <Label id={_id} options={options}>{field.label}</Label>}
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            {field.help ? <HelpMsg text={field.help} required={field._isRequired} options={options} /> : null}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
        </FormGroup>
    }
}

new Adapter({
    implements: IFormRowWidget,
    adapts: interfaces.IObjectField,
    
    Component: ObjectRow,
    doesNotRenderLabel: false
})

class ListRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(findDOMNode(this), 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(findDOMNode(this), 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, _id}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ListRow">
            {field.label && <Label id={_id} options={options}>{field.label}</Label>}
            {validationError ? <ErrorMsg validationError={validationError} submitted={submitted} options={options} /> : null}
            {invariantError ? <ErrorMsg validationError={invariantError} submitted={submitted} options={options} /> : null}
            {field.help ? <HelpMsg text={field.help} required={field._isRequired} options={options} /> : null}
            <div className="InfernoFormlib-RowFieldContainer">
                {children}
            </div>
        </FormGroup>
    }
}

new Adapter({
    implements: IFormRowWidget,
    adapts: interfaces.IListField,
    
    Component: ListRow,
    doesNotRenderLabel: false
})


class CheckboxRow extends Component {
    // TODO: Add animation support

    // support required
    componentDidMount () {
        if (this.props.formIsMounted) {
            animateOnAdd(findDOMNode(this), 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(findDOMNode(this), 'InfernoFormlib-Row--Animation')
    }

    render ({validationError, submitted, options, children, _id}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return (
            <FormGroup id={this.props.namespace.join('.') + '__Row'} check>
                <div className="InfernoFormlib-RowFieldContainer">
                    <_bs_Label id={_id} check>
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

new Adapter({
    implements: IFormRowWidget,
    adapts: interfaces.IBoolField,
    
    Component: CheckboxRow,
    doesNotRenderLabel: false
})

export { CheckboxRow, ObjectRow, Row, ErrorMsg, HelpMsg, Label, unpackInvariantErrors }