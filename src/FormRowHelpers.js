'use strict'

import { Component } from 'inferno'

import { renderString, renderVariables } from './widgets/common'
import { i18n } from 'isomorphic-schema'

import _bs_Label from 'inferno-bootstrap/lib/Form/Label'
import FormText from 'inferno-bootstrap/lib/Form/FormText'
import FormFeedback from 'inferno-bootstrap/lib/Form/FormFeedback'

import { findDOMNode } from 'inferno-extras'
import { animateOnAdd, animateOnRemove } from 'inferno-animation'

/*

    Components and helper functions for sending feedback to user about validation errors.

*/

function Label (props) {
  return <_bs_Label id={props.id}>{renderString(props.children, props.options && props.options.lang)}</_bs_Label>
}

function HelpMsg ({ field, text, id, required, options = {}}, context) {
  // don't render if nothing to show
  if (!text && !required) return null

  const outp = []
  if (text) outp.push(renderVariables(field, renderString(text, options.lang)))
  if (required) outp.push(renderVariables(field, renderString(i18n('isomorphic-schema--field_required', '(required)'), options.lang, '(required)')))

  if (context && context.renderHelpAsHtml) {
      return <FormText className="text-muted" for={id} dangerouslySetInnerHTML={{ __html: outp.join(' ')}} />
  } else {
      return <FormText className="text-muted" for={id}>{outp.join(' ')}</FormText>
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

class ErrorMsg extends Component {

    componentDidMount () {
        animateOnAdd(findDOMNode(this), 'InfernoFormlib-ErrorMsg--Animation')
    }
  
    componentWillUnmount () {
        animateOnRemove(findDOMNode(this), 'InfernoFormlib-ErrorMsg--Animation')
    }
  
    render ({ field, validationError, options = {}}) {
        return <FormFeedback>{renderVariables(field, renderString(validationError.i18nLabel, options.lang, validationError.message))}</FormFeedback>
    }
  }

export { Label, ErrorMsg, HelpMsg, unpackInvariantErrors }