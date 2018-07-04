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

import Button from 'inferno-bootstrap/lib/Button'
import Input from 'inferno-bootstrap/lib/Form/Input'
import InputGroup from 'inferno-bootstrap/lib/Form/InputGroup'
import Popover from 'inferno-bootstrap/lib/Popover'
import PopoverBody from 'inferno-bootstrap/lib/PopoverBody'
import PopoverHeader from 'inferno-bootstrap/lib/PopoverHeader'

import Nav from 'inferno-bootstrap/lib/Navigation/Nav'
import NavItem from 'inferno-bootstrap/lib/Navigation/NavItem'
import NavLink from 'inferno-bootstrap/lib/Navigation/NavLink'


import { Manager, Target } from 'inferno-popper'
// Placeholder

const months = 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_')
const weekdaysMin = 'sö_må_ti_on_to_fr_lö'.split('_')

const weekStartsOn = 1


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
      })}>{props.dayNr}</td>
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
        <a href="#showSelected" onClick={props.onShowSelected}>{props.value || 'välj ett datum'}</a>
      </div>
    </Popover>      
  )
}

class InputWidget extends Component {
    constructor (props) {
        super(props)

        let date = new Date()
        // Adjust internal date so UTC equals current timezone
        date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000 + 12 * 3600)

        this.state = {
            value: props.value,
            popoverOpen: false,
            showMonth: { year: date.getUTCFullYear(), month: date.getUTCMonth()}
        }
        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
        this.togglePopover = this.togglePopover.bind(this)
        this.doShowPopover = this.doShowPopover.bind(this)
        this.doHidePopover = this.doHidePopover.bind(this)

        this.doUpdateValue = this.doUpdateValue.bind(this)
        this.doUpdateShowMonth = this.doUpdateShowMonth.bind(this)
        this.doShowSelected = this.doShowSelected.bind(this)
        this.didClickBody = this.didClickBody.bind(this)
    }

    didClickBody (e) {
      if (this.state.popoverOpen) {
        let tmpNode = e.target
        let doesContainTarget = false
        
        while (tmpNode) {
          // NOTE: Using className to check if we clicked in the calendar. Should use better test.
          if (this._elInput.$LI.dom === tmpNode || (tmpNode.className && tmpNode.className.indexOf('InfernoFormlib-DateFieldCalendar') >= 0)) {
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
        this.setState({
            value: nextProps.value
        })

        // Todo: Update calendar
    }

    doUpdateValue (newDate) {
      this.setState({
        value: newDate // TODO: Update
      })
      this.didGetChange()
    }

    doUpdateShowMonth (newDate) {
      this.setState({
        showMonth: { year: newDate.getFullYear(), month: newDate.getMonth()}
      })
    }

    doShowSelected (e) {
      e.preventDefault()
      this.setState({
        showMonth: { year: parseInt(this.state.value.slice(0, 4)), month: parseInt(this.state.value.slice(5, 7)) - 1 }
      })
    }

    didGetInput (e) {
      const field = this.props.adapter.context
      const newVal = field.fromString(e.target.value)
      this.setState({
          value: newVal
      })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    togglePopover () {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      })
    }

    doShowPopover () {
      this.setState({
        popoverOpen: true
      })
      document.addEventListener('click', this.didClickBody)
    }

    doHidePopover (e) {
      this.setState({
        popoverOpen: false
      })
      document.removeEventListener('click', this.didClickBody)
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError ? false : undefined

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
                  placeholder={renderString(field.placeholder, options && options.lang, undefined, options && options.disableI18n)}
                  readOnly={field.readOnly}
                  value={field.toFormattedString(this.state.value)}

                  onFocus={this.doShowPopover}
                  onBlur={this.didClickBody}
                  
                  onChange={this.didGetInput} />
                {this.props.children}
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

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IDateField,
    Component: InputWidget
}).registerWith(globalRegistry)
