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

function CheckboxLabel (props) {
    return <_bs_Label>{renderString(props.children, props.options && props.options.lang)}</_bs_Label>
}

function HelpMsg (props) {
    const outp = []
    if (props.text) outp.push(renderString(props.text, props.options && props.options.lang))
    if (props.required) outp.push(renderString(i18n('isomorphic-schema--field_required', '(required)'), props.options && props.options.lang, '(required)'))

    return <FormText className="text-muted" for={props.id}>{outp.join(' ')}</FormText>
}

class ErrorMsg extends Component {

    componentDidMount () {
        animateOnAdd(this.$V.dom, 'InfernoFormlib-ErrorMsg--Animation')
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-ErrorMsg--Animation')
    }

    render () {
        return <FormFeedback>{renderString(this.props.validationError.i18nLabel, this.props.options && this.props.options.lang, this.props.validationError.message)}</FormFeedback>
    }
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
            animateOnAdd(this.$V.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-Row--Animation')
    }

    render () {
        const field = this.props.adapter.context

        const color = this.props.validationError ? 'danger' : undefined

        return <FormGroup id={this.props.namespace.join('.') + '__Row'} color={color}>
            {field.label && <Label id={this.props.id}>{field.label}</Label>}
            <div className="InfernoFormlib-RowFieldContainer">
                {this.props.children}
            </div>
            {this.props.validationError ? <ErrorMsg validationError={this.props.validationError} submitted={this.props.submitted} /> : null}
            {field.help && <HelpMsg text={field.help} required={field._isRequired} />}
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
            animateOnAdd(this.$V.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-Row--Animation')
    }

    render () {
        const field = this.props.adapter.context

        const color = this.props.validationError ? 'danger' : undefined

        return <FormGroup className="InfernoFormlib-ObjectRow" color={color}>
            {field.label && <Label id={this.props.id}>{field.label}</Label>}
            {(this.props.validationError ? <ErrorMsg validationError={this.props.validationError} submitted={this.props.submitted} /> : null)}
            {(field.helpMsg ? <HelpMsg text={field.helpMsg} required={field._isRequired} /> : null)}
            <div className="InfernoFormlib-RowFieldContainer">
                {this.props.children}
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
            animateOnAdd(this.$V.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-Row--Animation')
    }

    render () {
        const field = this.props.adapter.context

        const color = this.props.validationError ? 'danger' : undefined

        return <FormGroup className="InfernoFormlib-ListRow" color={color}>
            {field.label && <Label id={this.props.id}>{field.label}</Label>}
            {(this.props.validationError ? <ErrorMsg validationError={this.props.validationError} submitted={this.props.submitted} /> : null)}
            {(field.helpMsg ? <HelpMsg text={field.helpMsg} required={field._isRequired} /> : null)}
            <div className="InfernoFormlib-RowFieldContainer">
                {this.props.children}
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
            animateOnAdd(this.$V.dom, 'InfernoFormlib-Row--Animation')
        }
    }

    componentWillUnmount () {
        animateOnRemove(this.$V.dom, 'InfernoFormlib-Row--Animation')
    }

    render () {
        const field = this.props.adapter.context

        const color = this.props.validationError ? 'danger' : undefined

        return <FormGroup color={color} check>
            <div className="InfernoFormlib-RowFieldContainer">
                <CheckboxLabel id={this.props.id}>{field.label}</CheckboxLabel>
                {this.props.children}
            </div>
            {this.props.validationError ? <ErrorMsg validationError={this.props.validationError} submitted={this.props.submitted} /> : null}
            {field.helpMsg && <HelpMsg text={field.helpMsg} required={field._isRequired} />}
        </FormGroup>
    }
}

createAdapter({
    implements: IFormRowWidget,
    adapts: interfaces.IBoolField,
    
    Component: CheckboxRow
}).registerWith(globalRegistry)

export { CheckboxRow, ObjectRow, Row }
