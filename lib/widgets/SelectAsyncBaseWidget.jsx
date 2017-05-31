'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import classNames from 'classnames'

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
        this.props.onChange(this.props.propName, field.fromString(e.target.value))
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-SelectField": true,
            "InfernoFormlib-SelectField--readonly": field.readOnly
        }

        return <select className={classNames(cls)} type="text" readonly={field.readOnly && 'true'} value={this.props.value || ''} 
                    onChange={this.didGetChange}>
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {this.state.options.map((item) => <option value={item.name}>{item.title}</option>)}
        </select>
    }
}

/*
You need to register this widget for you custom field to make sure you get desired behaviour.

createAdapter({
    implements: IInputFieldWidget,
    adapts: IYourCustomField,
    Component: SelectAsyncBaseWidget,
}).registerWith(globalRegistry)
*/
