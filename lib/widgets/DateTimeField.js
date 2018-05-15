'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget } from '../interfaces'
import classNames from 'classnames'
import { renderString } from './common'
import { generateId, escapeIdSelector } from './utils'

import DateField from 'isomorphic-schema/lib/field_validators/DateField'

import Input from 'inferno-bootstrap/lib/Form/Input'
import InputGroup from 'inferno-bootstrap/lib/Form/InputGroup'
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
      this.didGetChange = this.didGetChange.bind(this)
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
  }

  didGetTimeInput (e) {
    e.preventDefault()
    let value = e.target.value

    const tmpNew = value.split(':')

    const newVal = this.state.value || new Date()
    newVal.setHours(tmpNew[0])
    newVal.setMinutes(tmpNew[1])
    newVal.setSeconds(tmpNew[2])

    this.setState({
        value: newVal
    })
  }

  didGetChange (e) {
      this.props.onChange(this.props.propName, this.state.value)
  }

  render () {
      const field = this.props.adapter.context

      const isValid = this.props.validationError ? false : undefined

      let dateStr
      if (this.state.value) {
        const val = this.state.value
        dateStr = `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`
      }
      
      const dateNamespace = this.props.namespace.splice()
      dateNamespace.push('_date')

      const dummyAdapter = {
        context: new DateField({
          placeholder: 'yyyy-mm-dd',
          readOnly: field.readOnly

        })
      }

      return (
        <InputGroup>
          <DateInput
            adapter={dummyAdapter}
            inputName={this.props.inputName + '_date'}
            namespace={dateNamespace}
            valid={isValid}
            value={dateStr}

            onChange={this.didGetDateInput} />

          <Input
            id={generateId(this.props.namespace, '_time__Field')}
            name={this.props.inputName + '_time'}
            valid={isValid}
            placeholder={renderString('hh:mm:ss')}
            readOnly={field.readOnly}
            value={this.state.value && this.state.value.toLocaleTimeString()}

            onChange={this.didGetTimeInput} />

        </InputGroup>
      )  
  }
}

export default InputWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDateField,
    Component: InputWidget
}).registerWith(globalRegistry)
