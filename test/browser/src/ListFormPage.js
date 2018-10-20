import { Component } from 'inferno'

import {
  Schema,
  TextField,
  ListField
} from 'isomorphic-schema'
import '../../../src/widgets/InputField'
import '../../../src/widgets/ListField'
import '../../../src/widgets/FormRow'

import { FormRows } from '../../../src/FormRows'
import {
  Button,
  Col,
  Row,
  Form
} from 'inferno-bootstrap'

const listItemSchema = new Schema('ListItem Schema', {
  title: new TextField({
    label: 'Title',
    placeholder: 'Type here...',
    required: true
  })
})

const formSchema = new Schema('Form Schema', {
  list: new ListField({
    label: 'Title',
    valueType: new TextField({
      label: 'Title',
      placeholder: 'Type here...',
      required: true
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
                <h1>Sample Form With List Field</h1>
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