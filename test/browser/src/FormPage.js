import { Component } from 'inferno'
import { globalRegistry, createUtility } from 'component-registry'
import axios from 'axios'

import { Schema } from 'isomorphic-schema'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import AnyOf from 'isomorphic-schema/lib/field_validators/AnyOf'
import EmailField from 'isomorphic-schema/lib/field_validators/EmailField'
import BoolField from 'isomorphic-schema/lib/field_validators/BoolField'
import SelectField from 'isomorphic-schema/lib/field_validators/SelectField'
import IntegerField from 'isomorphic-schema/lib/field_validators/IntegerField'
import DecimalField from 'isomorphic-schema/lib/field_validators/DecimalField'
import TextAreaField from 'isomorphic-schema/lib/field_validators/TextAreaField'
import ListField from 'isomorphic-schema/lib/field_validators/ListField'
import ObjectField from 'isomorphic-schema/lib/field_validators/ObjectField'

import '../../../lib/widgets/InputField'
import '../../../lib/widgets/AnyOf'
import '../../../lib/widgets/BoolField'
import '../../../lib/widgets/SelectField'
import '../../../lib/widgets/TextAreaField'
import '../../../lib/widgets/ListField'
import '../../../lib/widgets/ObjectField'
import '../../../lib/widgets/FormRow'
import { ActionBar } from '../../../lib/widgets/ActionBar'
import { getElOffset } from '../../../lib/widgets/utils'

import { FormRows } from '../../../lib/FormRows'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/lib/Col'
import Form from 'inferno-bootstrap/lib/Form/Form'
import Row from 'inferno-bootstrap/lib/Row'

const listItemSchema = new Schema('ListItem Schema', {
  score: new IntegerField({
    label: 'Score',
    required: true
  })
})

const subFormSchema = new Schema('SubForm Schema', {
  height: new DecimalField({
    label: 'Height',
    placeholder: 'i.e. 1.93',
    help: 'Height is in meters',
    required: true
  }),
  weight: new IntegerField({
    label: 'Weight',
    placeholder: 'i.e. 75',
    help: 'Weight is in kg without decimal',
    required: true
  })
})

const formSchema = new Schema('Form Schema', {
  active: new BoolField({
    label: 'Active'
  }),
  any: new AnyOf({
    label: 'test',
    required: true
  }),
  title: new TextField({
    label: 'Title',
    placeholder: 'Type here...',
    required: true
  }),
  email: new EmailField({
    label: 'E-mail',
    placeholder: 'person@email.com',
    required: true
  }),
  age: new IntegerField({
    label: 'Age',
    placeholder: 'i.e. 16',
    required: true
  }),
  type: new SelectField({
    label: 'Type',
    options: [
      { name: 'human', title: 'Human'},
      { name: 'bird', title: 'Bird'},
      { name: 'mamal', title: 'Mamal'},
      { name: 'fish', title: 'Fish'},
    ],
    valueType: new TextField()
  }),
  bio: new TextAreaField({
    label: 'Bio',
    placeholder: 'Type here...',
    required: true
  }),
  stats: new ObjectField({
    label: 'Stats',
    schema: subFormSchema,
    required: true
  }),
  scores: new ListField({
    label: 'Scores',
    valueType: new ObjectField({
      schema: listItemSchema
    })
  })
})

export default class Page extends Component {

    constructor (props) {
        super(...arguments)

        this.state = {
            value: {},
            validationError: undefined,
            submitted: false,
            actionbarBoundary: {top: 0, bottom: 0}
        }

        this.didChange = this.didChange.bind(this)
        this.doSubmit = this.doSubmit.bind(this)
    }

    _calculateToolbarBoundary () {
      var bottomBoundary = window.visualViewport.height // getElOffset(formEl).top + formEl.clientHeight
      var topBoundary = 0 // getElOffset(formEl).top
      
      this.setState({
          actionbarBoundary: { 
              top: topBoundary, 
              bottom: bottomBoundary
          }
      })
    }

    componentDidMount () {
      this._calculateToolbarBoundary.call(this)
    }

    doSubmit (e) {
      e.preventDefault()
      const errors = formSchema.validate(this.state.value)
      this.setState({
        validationError: errors,
        submitted: true
      })
    }

    didChange (propName, value) {
      const val = this.state.value
      val[propName] = value
      this.setState({
          value: val
      })
      // This is where you would call this.props.onChange
    }

    render () {
        const isValid = this.state.validationError ? false : undefined

        return (
            <div className="TestContainer">
                <div className="DebugMarker" style={{top: this.state.actionbarBoundary.top, position: 'fixed'}} />
                <div className="DebugMarker" style={{top: this.state.actionbarBoundary.bottom, position: 'fixed'}} />
                <h1>Sample Form With Submit</h1>
                <Form onSubmit={this.doSubmit} className='IEditItem'>
                  <Row>
                    <Col>
                      <FormRows className="col" schema={formSchema} validationErrors={this.state.validationError} value={this.state.value} onChange={this.didChange} />
                    </Col>
                  </Row>
                  <ActionBar boundary={this.state.actionbarBoundary}>
                    <Row>
                      <Col>
                        <Button type="submit">Save</Button>
                      </Col>
                    </Row>
                  </ActionBar>
                </Form>
                <div style={{height: "30rem"}} />
            </div>
        )
    }
}