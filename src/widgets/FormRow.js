'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces, i18n } from 'isomorphic-schema'
import { IFormRowWidget }  from '../interfaces'

import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import classNames from 'classnames'
import { renderString } from './common'

import FormFeedback from 'inferno-bootstrap/lib/Form/FormFeedback'
import FormText from 'inferno-bootstrap/lib/Form/FormText'
import FormGroup from 'inferno-bootstrap/lib/Form/FormGroup'
import _bs_Label from 'inferno-bootstrap/lib/Form/Label'

function Label (props) {
    return <_bs_Label>{renderString(props.children, props.options && props.options.lang)}</_bs_Label>
}

function HelpMsg (props, context) {
    // don't render if nothing to show
    if (!props.text && !props.required) return null

    const outp = []
    if (props.text) outp.push(renderString(props.text, props.options && props.options.lang))
    if (props.required) outp.push(renderString(i18n('isomorphic-schema--field_required', '(required)'), props.options && props.options.lang, '(required)'))

    if (context && context.renderHelpAsHtml) {
        return <FormText className="text-muted" for={props.id} dangerouslySetInnerHTML={{ __html: outp.join(' ')}} />
    } else {
        return <FormText className="text-muted" for={props.id}>{outp.join(' ')}</FormText>
    }
}

class ErrorMsg extends Component {

    componentDidMount () {
        animateOnAdd(this.$LI.dom, 'InfernoFormlib-ErrorMsg--Animation')
    }

    componentWillUnmount () {
        animateOnRemove(this.$LI.dom, 'InfernoFormlib-ErrorMsg--Animation')
    }

    render () {
        return <FormFeedback>{renderString(this.props.validationError.i18nLabel, this.props.options && this.props.options.lang, this.props.validationError.message)}</FormFeedback>
    }
}

function unpackInvariantErrors (validationError, namespace) {
    if (validationError === undefined) return

    let invariantError
    if (Array.isArray(validationError.invariantErrors)){
        
        const dotName = namespace.join('.')
        let tmpInvErrs = validationError.invariantErrors.filter((invErr) => {
            // Pattern match field name of error with current namespace to see if it is a match
            return invErr.fields.reduce((prev, curr) => prev || (curr === dotName), false)
        })
        
        if (tmpInvErrs.length > 1) {
            invariantError = {
                message: 'There are several form value errors here',
                i18nLabel: 'inferno-formlib--multiple_invariant_errors'
            }
        } else {
            invariantError = tmpInvErrs[0]
        }
    }
    return invariantError
}

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

    render ({validationError, submitted, options, children}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup id={this.props.namespace.join('.') + '__Row'}>
            {field.label && <Label id={this.props.id} options={options}>{field.label}</Label>}
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
    
    Component: Row
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

    render ({validationError, submitted, options, children}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ObjectRow">
            {field.label && <Label id={this.props.id} options={options}>{field.label}</Label>}
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
    
    Component: ObjectRow
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

    render ({validationError, submitted, options, children}) {
        const field = this.props.adapter.context
        
        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return <FormGroup className="InfernoFormlib-ListRow">
            {field.label && <Label id={this.props.id} options={options}>{field.label}</Label>}
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
    
    Component: ListRow
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

    render ({validationError, submitted, options, children}) {
        const field = this.props.adapter.context

        const invariantError = unpackInvariantErrors(this.props.validationError, this.props.namespace)

        return (
            <FormGroup id={this.props.namespace.join('.') + '__Row'} check>
                <div className="InfernoFormlib-RowFieldContainer">
                    <_bs_Label id={this.props.id} check>
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
    
    Component: CheckboxRow
}).registerWith(globalRegistry)

export { CheckboxRow, ObjectRow, Row, ErrorMsg, HelpMsg, Label, unpackInvariantErrors }
