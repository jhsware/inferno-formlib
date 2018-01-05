import Component from 'inferno-component'
import { globalRegistry, createUtility } from 'component-registry'
import axios from 'axios'

import { Schema } from 'isomorphic-schema'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import EmailField from 'isomorphic-schema/lib/field_validators/EmailField'
import BoolField from 'isomorphic-schema/lib/field_validators/BoolField'
import SelectField from 'isomorphic-schema/lib/field_validators/SelectField'
import IntegerField from 'isomorphic-schema/lib/field_validators/IntegerField'
import DecimalField from 'isomorphic-schema/lib/field_validators/DecimalField'
import TextAreaField from 'isomorphic-schema/lib/field_validators/TextAreaField'
import ListField from 'isomorphic-schema/lib/field_validators/ListField'
import ObjectField from 'isomorphic-schema/lib/field_validators/ObjectField'
import '../../../lib/widgets/InputField.jsx'
import '../../../lib/widgets/BoolField.jsx'
import '../../../lib/widgets/SelectField.jsx'
import '../../../lib/widgets/TextAreaField.jsx'
import '../../../lib/widgets/ListField.jsx'
import '../../../lib/widgets/ObjectField.jsx'
import '../../../lib/widgets/FormRow.jsx'

import { FormRows } from '../../../lib/FormRows.jsx'
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
    ]
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
            submitted: false
        }

        this.didChange = this.didChange.bind(this)
        this.doSubmit = this.doSubmit.bind(this)
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
                <h1>Sample Form With Submit</h1>
                <Form onSubmit={this.doSubmit} className='IEditItem'>
                  <Row>
                    <Col>
                      <FormRows className="col" schema={formSchema} validationErrors={this.state.validationError} value={this.state.value} onChange={this.didChange} />
                    </Col>
                  </Row>
                  <Row className="InfernoFormlib-ActionBar">
                    <Col>
                      <Button type="submit">Save</Button>
                    </Col>
                  </Row>
                </Form>
      
            </div>
        )
    }
}