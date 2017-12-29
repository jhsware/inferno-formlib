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

const formSchema = new Schema('Form Schema', {
  title: new TextField({
    label: 'Title',
    placeholder: 'Type here...',
    required: true
  }),
  image: new ImageField({
    label: 'Image',
    placeholder: 'Click or drag to upload...',
    uploadUtilName: 'Image.Simple'
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

        this.doClearImage = this.doClearImage.bind(this)
        this.didChange = this.didChange.bind(this)
    }

    doClearImage (e) {
      e.preventDefault()
      this.setState({
          value: undefined
      })
      // This is where you would call this.props.onChange
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
                </Form>
      
            </div>
        )
    }
}