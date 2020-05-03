'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { Adapter } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget } from '../interfaces'
import classnames from 'classnames'
import { renderString } from './common'
import { generateId } from './utils'

import { DateField } from 'isomorphic-schema'
import { Input } from 'inferno-bootstrap'
import DateInput from './DateField'

function pad (inp) {
  if (inp === undefined) {
    return
  } else if (inp.toString().length === 1) {
    return '0' + inp
  } else {
    return inp
  }
}

function isProperDateTime (inp) {
  return !isNaN(new Date(inp).getTime())
}

class InputWidget extends Component {
  constructor (props) {
      super(props)

      this.state = {
          value: props.value,
      }
  }

  componentWillReceiveProps (nextProps) {
      this.setState({
          value: nextProps.value
      })

      // Todo: Update calendar
  }

  didGetDateInput = (propName, value) => {
    if (typeof value === 'string') {
      const tmpNew = value.split('-')

      value = this.state.value || new Date()
      value.setFullYear(tmpNew[0])
      value.setMonth(tmpNew[1] - 1)
      value.setDate(tmpNew[2])
    }

    this.setState({
        value,
        popoverOpen: this.state.popoverOpen && isProperDateTime(value)
    })
    if (value === undefined || isProperDateTime(value)) {
      this.props.onChange(this.props.propName, value)
    }
  }

  didGetTimeInput = (e) => {
    e.preventDefault()
    let value = e.target.value

    if (typeof value === 'string') {
      const tmpNew = value.split(/[^\d]/).map((n) => parseInt(n))
  
      // Handle 12 hour clock https://www.timeanddate.com/time/am-and-pm.html
      if (value.indexOf('pm') > 0) {
        if (tmpNew[0] < 12) {
          tmpNew[0] += 12
        } 
      } else if (value.indexOf('am') > 0) {
        if (tmpNew[0] === 12 && tmpNew[1] > 0) {
          tmpNew[0] = 0
        }
      }
  
      value = this.state.value || new Date()
      value.setHours(tmpNew[0] || 0)
      value.setMinutes(tmpNew[1] || 0)
      value.setSeconds(tmpNew[2] || 0)
    }

    this.setState({
        value,
        popoverOpen: this.state.popoverOpen && isProperDateTime(value)
    })

    if (value === undefined || isProperDateTime(value)) {
      this.props.onChange(this.props.propName, value)
    }
  }

  render ({inputName, namespace, options, doesNotRenderLabel, id}) {
      const field = this.props.adapter.context

      const isValid = this.props.validationError || this.props.invariantError ? false : undefined

      let dateStr
      if (this.state.value) {
        const val = this.state.value
        dateStr = `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`
      }
      
      const dateNamespace = namespace.slice()
      dateNamespace.push('_date')

      const dummyAdapter = {
        context: new DateField({
          placeholder: field.placeholder,
          readOnly: field.readOnly

        })
      }

      const ariaLabels = {
        'aria-invalid': isValid !== undefined,
        'aria-labelledby': doesNotRenderLabel ? undefined : id,
        'aria-label': doesNotRenderLabel ? renderString(field.label || 'inferno-formlib--InputField', options && options.lang, 'DateTime Field') : undefined,
        'aria-required': field._isRequired ? field._isRequired : undefined
      } 

      return (
        <DateInput
          className={classnames('InfernoFormlib-DateTimeGroup', {'InfernoFormlib-DateTimeGroup--noValue': !this.state.value})}
          innerClassName="InfernoFormlib-DateTime_date"
          adapter={dummyAdapter}
          inputName={inputName + '_date'}
          namespace={dateNamespace}
          valid={isValid}
          value={dateStr}
          id={id}
          doesNotRenderLabel={doesNotRenderLabel}

          onChange={this.didGetDateInput}>
          <Input
            className="InfernoFormlib-DateTime_time"
            id={generateId(this.props.namespace, '_time__Field')}
            name={this.props.inputName + '_time'}
            valid={isValid}
            placeholder={renderString('hh:mm:ss', options && options.lang)}
            readOnly={field.readOnly}
            value={this.state.value && this.state.value.toLocaleTimeString()}

            {...ariaLabels}

            onChange={this.didGetTimeInput} />
        </DateInput>
      )  
  }
}

export default InputWidget

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDateTimeField,
    Component: InputWidget
})
