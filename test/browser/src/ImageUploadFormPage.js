import Component from 'inferno-component'
import { globalRegistry, createUtility } from 'component-registry'
import axios from 'axios'

import { IFileUploadUtil } from '../../../lib/interfaces'
import { Schema } from 'isomorphic-schema'
import { ImageField } from './ImageUploadWidget'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import { FileUploadWidget } from '../../../lib/widgets/FileUploadWidget'
import '../../../lib/widgets/InputField.jsx'
import '../../../lib/widgets/FormRow.jsx'

import { FormRows } from '../../../lib/FormRows.jsx'
import Form from 'inferno-bootstrap/lib/Form/Form'
import Row from 'inferno-bootstrap/lib/Row'
import Col from 'inferno-bootstrap/lib/Col'
import Button from 'inferno-bootstrap/lib/Button'

const formSchema = new Schema('Form Schema', {
  title: new TextField({
    label: 'Title',
    placeholder: 'Type here...',
    required: true
  }),
  image: new ImageField({
    label: 'Image',
    placeholder: 'Click or drag to upload...',
    uploadUtilName: 'Image.Simple',
    required: true
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
                <h1>Image Upload In Form</h1>
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