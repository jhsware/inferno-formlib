'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget } from '../interfaces'
import classnames from 'classnames'
import { renderString } from './common'
import { generateId, escapeIdSelector } from './utils'

import DateField from 'isomorphic-schema/lib/field_validators/DateField'
import Input from 'inferno-bootstrap/lib/Form/Input'
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

class InputWidget extends Component {
  constructor (props) {
      super(props)

      this.state = {
          value: props.value,
      }
      this.didGetDateInput = this.didGetDateInput.bind(this)
      this.didGetTimeInput = this.didGetTimeInput.bind(this)
  }

  componentWillReceiveProps (nextProps) {
      this.setState({
          value: nextProps.value
      })

      // Todo: Update calendar
  }

  didGetDateInput (propName, value) {
    const tmpNew = value.split('-')

    const newVal = this.state.value || new Date()
    newVal.setFullYear(tmpNew[0])
    newVal.setMonth(tmpNew[1] - 1)
    newVal.setDate(tmpNew[2])

    this.setState({
        value: newVal
    })
    this.props.onChange(this.props.propName, newVal)
  }

  didGetTimeInput (e) {
    e.preventDefault()
    let value = e.target.value

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

    const newVal = this.state.value || new Date()
    newVal.setHours(tmpNew[0])
    newVal.setMinutes(tmpNew[1])
    newVal.setSeconds(tmpNew[2] || 0)

    this.setState({
        value: newVal
    })
    this.props.onChange(this.props.propName, newVal)
  }

  render ({inputName, namespace, options}) {
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

      return (
        <DateInput
          className={classnames('InfernoFormlib-DateTimeGroup', {'InfernoFormlib-DateTimeGroup--noValue': !this.state.value})}
          innerClassName="InfernoFormlib-DateTime_date"
          adapter={dummyAdapter}
          inputName={inputName + '_date'}
          namespace={dateNamespace}
          valid={isValid}
          value={dateStr}

          onChange={this.didGetDateInput}>
          <Input
            className="InfernoFormlib-DateTime_time"
            id={generateId(this.props.namespace, '_time__Field')}
            name={this.props.inputName + '_time'}
            valid={isValid}
            placeholder={renderString('hh:mm:ss', options && options.lang)}
            readOnly={field.readOnly}
            value={this.state.value && this.state.value.toLocaleTimeString()}

            onChange={this.didGetTimeInput} />
        </DateInput>
      )  
  }
}

export default InputWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDateTimeField,
    Component: InputWidget
}).registerWith(globalRegistry)
