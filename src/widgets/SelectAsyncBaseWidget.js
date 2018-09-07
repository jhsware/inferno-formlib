'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component } from 'inferno'

import { renderString } from './common'
import { generateId } from './utils'

import Input from 'inferno-bootstrap/lib/Form/Input'

// Placeholder
function _getOptionsAsync (nextProps) {
    // TODO: How do we supply these because they could be used to get options
    const options = undefined
    const context = undefined
    
    this.props.adapter.context.getOptionsAsync(nextProps.value, options, context)
        .then((results) => {
            this.setState({
                options: results
            })  
        })
        .catch(() => {
            this.setState({
                options: [{ name: nextProps.value, title: 'Fel när data laddades...'}]
            })            
        })
}

export default class SelectAsyncBaseWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
          options: [{ name: props.value, title: 'Laddar...'}]
        }

        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
      // Get new options from field
      if (nextProps.adapter.context !== this.props.adapter.context) {
        _getOptionsAsync.call(this, nextProps)
      }
    }

    componentDidMount () {
        _getOptionsAsync.call(this, this.props)
    }

    didGetChange (e) {
        const field = this.props.adapter.context
        this.props.onChange(this.props.propName, field.fromString(field.valueType.fromString(e.target.value)))
    }

    render ({inputName, namespace, options}) {
        const field = this.props.adapter.context

        const isValid = this.props.validationError || this.props.invariantError ? false : undefined

        return <Input type="select"
            id={generateId(namespace, '__Field')}
            name={inputName}
            readOnly={field.readOnly}
            value={field.valueType.toFormattedString(field.toFormattedString(this.props.value))}
            valid={isValid}
            onChange={this.didGetChange}>
            {field.placeholder && <option value="">{renderString(field.placeholder, options && options.lang)}</option>}
            {this.state.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </Input>
    }
}

/*
You need to register this widget for you custom field to make sure you get desired behaviour.

new Adapter({
    implements: IInputFieldWidget,
    adapts: IYourCustomField,
    Component: SelectAsyncBaseWidget,
})
*/
