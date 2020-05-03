'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'
import { findDOMNode } from 'inferno-extras'
import { Adapter } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget } from '../interfaces'
import classNames from 'classnames'
import { renderString } from './common'
import { generateId, escapeIdSelector } from './utils'
import classnames from 'classnames'

import {
  Input,
  InputGroup,
  Popover,
  PopoverBody,
  PopoverHeader,
  Nav,
  NavItem,
  NavLink
} from 'inferno-bootstrap'

import { Manager, Target } from 'inferno-popper'

const weekStartsOn = 1

function isProperDate (inp) {
  return typeof inp === 'string' && inp.length === 10 && !isNaN(new Date(inp).getTime())
}

function toMs (days) {
  return days * 24 * 3600000
}

function CalendarDay (props) {
  return (
    <td onClick={(e) => { e.preventDefault(); props.onClick(props.value)}}
      className={classNames("DateFieldItem", {
        "text-muted": !props.isCurrentMonth,
        "DateFieldItem--selected": props.isSelected,
        "DateFieldItem--today": props.isToday
      })}><a href='#'>{props.dayNr}</a></td>
  )
}

function getCalendar (date, locale) {
  const today = new Date()
  const firstOfMonth = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1)
  const showDays = []
  let rowNr = 0
  // Get first day to show
  let tmpDay = new Date(firstOfMonth.valueOf() - toMs(firstOfMonth.getUTCDay() ? firstOfMonth.getUTCDay() - weekStartsOn : 7 - weekStartsOn))
  while (rowNr === 0 || (tmpDay.getUTCMonth() === date.getUTCMonth()) || (tmpDay.getUTCDay() - weekStartsOn !== 0)) {
    showDays.push({
      dayNr: tmpDay.getUTCDate(),
      isCurrentMonth: tmpDay.getUTCMonth() === date.getUTCMonth(),
      isToday: tmpDay.getUTCFullYear() === today.getFullYear() && tmpDay.getUTCMonth() === today.getMonth() && tmpDay.getUTCDate() === today.getDate(),
      value: tmpDay.toISOString().slice(0, 10)
    })

    tmpDay = new Date(tmpDay.valueOf() + toMs(1))
    if ((tmpDay.getUTCDate() - weekStartsOn) % 7 === 0) {
      rowNr++
    }
  }

  const weekdaysMin = renderString('inferno-formlib--DateField-weekdays', undefined, 'sö_må_ti_on_to_fr_lö').split('_')
  const months = renderString('inferno-formlib--DateField-months', undefined, 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december').split('_')

  const cal = {
    monthName: months[date.getUTCMonth()],
    year: date.getUTCFullYear(),
    dayHeaders: weekdaysMin.map((item, index) => {
      return weekdaysMin[(index + weekStartsOn) % 7] // rotate weekdays by weekStartsOn
    }),
    days: showDays
  }
  return cal
}

function Calendar (props) {
  const { showMonth, ...popoverProps} = props

  const tmpDate = new Date(showMonth.year, showMonth.month, 2)
  const currentMonth = new Date(tmpDate)
  
  const calendar = getCalendar(tmpDate)

  const rows = []
  let days = []
  let i = 0
  calendar.days.forEach((day, i) => {
    days.push(<CalendarDay value={day.value} isSelected={day.value === props.value} isCurrentMonth={day.isCurrentMonth} isToday={day.isToday} dayNr={day.dayNr} onClick={props.onSelect} />)
    i++
    if (i % 7 === 0) {
      rows.push(<tr>{days}</tr>)
      days = []
    } else if (i === (calendar.days.length)) {
      rows.push(<tr>{days}</tr>)
      days = []
    }
  })

  return (
    <Popover {...popoverProps}>
      <PopoverHeader>
        <Nav style={{ width: "100%"}}>
          <NavItem>
            <NavLink href="<" onClick={(e) => { e.preventDefault(); props.onNavigate(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))) }}>{'<'}</NavLink>
          </NavItem>
          <NavItem className="DateFieldMonth">
            <NavLink href="#" onClick={(e) => { e.preventDefault(); }}>
              <small>{calendar.year}</small>
              {' ' + calendar.monthName}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href=">" onClick={(e) => { e.preventDefault(); props.onNavigate(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))) }}>{'>'}</NavLink>
          </NavItem>
        </Nav>
      </PopoverHeader>
      <PopoverBody className="DateFieldBody">
        <table style={{ width: "100%"}}>
          <tbody>
            <tr className="DateFieldHeaderRow">
              {calendar.dayHeaders.map(day => <th className="DateFieldHeaderItem">{day}</th>)}
            </tr>
            {rows}
          </tbody>
        </table>
      </PopoverBody>
      <div className="DateFieldFooter">
        <a href="#showSelected" onClick={props.onShowSelected}>{props.value || renderString('inferno-formlib--DateField-select_date', undefined, 'välj ett datum')}</a>
      </div>
    </Popover>      
  )
}

class InputWidget extends Component {
    constructor (props) {
        super(props)

        // Show the month of the current date value
        let date
        if (isProperDate(props.value)) {
          date = new Date(props.value)
        }
        else {
          date = new Date()
        }
        // Adjust internal date so UTC equals current timezone
        date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000 + 12 * 3600)

        this.state = {
            value: props.value,
            popoverOpen: false,
            showMonth: { year: date.getUTCFullYear(), month: date.getUTCMonth()}
        }
    }

    didClickBody = (e) => {
      if (this.state.popoverOpen) {
        let tmpNode = e.target
        let doesContainTarget = false
        
        while (tmpNode) {
          // NOTE: Using className to check if we clicked in the calendar. Should use better test.
          if (findDOMNode(this._elInput) === tmpNode || (tmpNode.className && tmpNode.className.indexOf('InfernoFormlib-DateFieldCalendar') >= 0)) {
            doesContainTarget = true
            break
          }
          tmpNode = tmpNode.parentNode
        }

        if (!doesContainTarget) {
          this.doHidePopover()
        }
      }
    }

    componentWillUnmount () {
      this.doHidePopover()
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState({
            value: nextProps.value,
            popoverOpen: this.state.popoverOpen && isProperDate(nextProps.value)
        })

        // Update calendar
        let date = isProperDate(nextProps.value) ? new Date(nextProps.value) : new Date()
        // Adjust internal date so UTC equals current timezone
        date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000 + 12 * 3600)
        this.doUpdateShowMonth(date)
      }
    }

    doUpdateValue = (newDate) => {
      this.setState({
        value: newDate // TODO: Update
      })
      this.props.onChange(this.props.propName, newDate)
    }

    doUpdateShowMonth = (newDate) => {
      this.setState({
        showMonth: { year: newDate.getFullYear(), month: newDate.getMonth()}
      })
    }

    doShowSelected = (e) => {
      e.preventDefault()
      this.setState({
        showMonth: { year: parseInt(this.state.value.slice(0, 4)), month: parseInt(this.state.value.slice(5, 7)) - 1 }
      })
    }

    didGetInput = (e) => {
      const field = this.props.adapter.context
      const value = field.fromString(e.target.value)
      this.setState({
        value,
        popoverOpen: this.state.popoverOpen && isProperDate(value)
      })
      if (value === undefined || isProperDate(value)) {
        this.props.onChange(this.props.propName, value)
      }
    }

    togglePopover = () => {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      })
    }

    doShowPopover = () => {
      if (!this.state.popoverOpen) {
        this.setState({
          popoverOpen: true
        })
        document.addEventListener('click', this.didClickBody)
      }
    }

    doHidePopover = (e) => {
      if (this.state.popoverOpen) {
        this.setState({
          popoverOpen: false
        })
        document.removeEventListener('click', this.didClickBody)
      }
    }

    doUnset = (e) => {
      e.preventDefault()
      this.props.onChange(this.props.propName, undefined)
    }

    render ({inputName, namespace, options, doesNotRenderLabel, id}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined

        const ariaLabels = {
          'aria-invalid': isValid !== undefined,
          'aria-labelledby': doesNotRenderLabel ? undefined : id,
          'aria-label': doesNotRenderLabel ? renderString(field.label || 'inferno-formlib--InputField', options && options.lang, 'Date Field') : undefined,
          'aria-required': field._isRequired ? field._isRequired : undefined
        } 

        const inputId = generateId(namespace, '__Field')
        
        // TODO: onBlur={this.doHidePopover}
        return (
          <Manager ref={(el) => this._el = el}>
            <Target>
              <InputGroup className={this.props.className}>
                <Input ref={(el) => this._elInput = el}
                  className={this.props.innerClassName}
                  id={inputId}
                  name={inputName}
                  valid={isValid}
                  placeholder={renderString(field.placeholder, options && options.lang)}
                  readOnly={field.readOnly}
                  value={field.toFormattedString(this.state.value)}

                  {...ariaLabels}

                  onFocus={this.doShowPopover}
                  onBlur={this.didClickBody}
                  
                  onInput={this.didGetInput} />
                {this.props.children}
                <a href="#clear" className="InfernoFormlib-DateField-unset" onClick={this.doUnset}>x</a>
              </InputGroup>
            </Target>
            <Calendar
              className="InfernoFormlib-DateFieldCalendar"
              showMonth={this.state.showMonth}
              value={this.state.value}
              placement="bottom" isOpen={this.state.popoverOpen} target={escapeIdSelector(inputId)}

              onNavigate={this.doUpdateShowMonth}
              onShowSelected={this.doShowSelected}
              onSelect={this.doUpdateValue} />
          </Manager>
        )  
    }
}

export default InputWidget

new Adapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDateField,
    Component: InputWidget
})
