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
import { animateOnAdd, animateOnRemove } from 'inferno-animation'

import classNames from 'classnames'


// Placeholder

class AutocompleteItem extends Component {
    constructor (props) {
        super(props)
        this.didClick = this.didClick.bind(this)
    }

    componentDidMount () {
        animateOnAdd(this, 'InfernoFormlib-AutocompleteItem--Animation')
    }

    componentWillUnmount () {
        animateOnRemove(this, 'InfernoFormlib-AutocompleteItem--Animation')
    }

    didClick (e) {
      e.preventDefault()
      this.props.onSelect(this.props.value)
    }

    render () {
        return <div className="InfernoFormlib-AutocompleteItem" onClick={this.didClick}>{this.props.title}</div>
    }
}

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

class AutoCompleteBaseWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            text: props.value,
            options: []
        }

        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
        this.didSelect = this.didSelect.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        // TODO: How do we supply these because they could be used to get options
        const options = undefined
        const context = undefined

        if (nextProps.value !== this.props.value) {
            this.props.adapter.context.getOptionTitleAsync(nextProps.value, options, context)
              .then((title) => {
                  this.setState({
                      text: title
                  })  
              })
              .catch(() => {
                  this.setState({
                      text: nextProps.value
                  })            
              })
        }
        this.setState({
            value: nextProps.value
        })
    }

    didGetInput (e) {
        // TODO: How do we supply these because they could be used to get options
        const options = undefined
        const context = undefined

        if (e.target.value !== this.state.text) {
            _getOptionsAsync.call(this, e.target.value, options, context)
        }

        this.setState({
            text: e.target.value
        })
    }

    didGetChange (e) {
        // Not doing anything for now
    }

    didSelect (value) {
      const field = this.props.adapter.context
      this.props.onChange(this.props.propName, field.valueType.fromString(this.state.value))
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "InfernoFormlib-TextField": true,
            "InfernoFormlib-TextField--readonly": field.readOnly
        }

        return <div className="InfernoFormlib-AutoCompleteField">
          <input className={classNames(cls)} type="text" placeholder={field.placeholder} readonly={field.readOnly && 'true'} value={this.state.text} 
                 onChange={this.didGetChange} onInput={this.didGetInput} />
          <div className="InfernoFormlib-AutoCompleteItemContainer">
            {this.state.options.map((item) => <AutocompleteItem key={item.name} value={item.name} title={item.title} onSelect={this.didSelect} />)}
          </div>
        </div>
    }
}

export default AutoCompleteBaseWidget

/*
You need to register this widget for you custom field to make sure you get desired behaviour.

createAdapter({
    implements: IInputFieldWidget,
    adapts: IYourCustomField,
    Component: AutoCompleteBaseWidget,
}).registerWith(globalRegistry)
*/