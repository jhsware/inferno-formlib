import { Component } from 'inferno'
import { FileUploadWidget } from '../../../../src/widgets/FileUploadWidget'
import { renderString } from '../../../../src/widgets/common'
import { generateId } from '../../../../src/widgets/utils'

import {
    Card,
    CardBody,
    CardFooter,
    CardImg
} from 'inferno-bootstrap'

export default class ImageFieldWidget extends Component {
  constructor (props) {
      super(props)

      this.state = {
          value: props.value
      }
      this.didGetChange = this.didGetChange.bind(this)
      this.doClearImage = this.doClearImage.bind(this)
  }

  componentWillReceiveProps (nextProps) {
      this.setState({
          value: nextProps.value
      })
  }

  doClearImage (e) {
    e.preventDefault()
    this.setState({
        value: undefined
    })
    this.props.onChange(this.props.propName, undefined)
  }

  didGetChange (propName, data) {
    const field = this.props.adapter.context
    this.setState({
      value: field.fromString(data)
    })
    this.props.onChange(this.props.propName, field.fromString(data))
  }

  renderImage () {
    return (
        <Card className="ImageField">
            <CardImg width='100%' src={this.props.value} />
            <CardBody>
                <CardFooter>
                    <a className="ImageField-Action text-danger" href="#clear" onClick={this.doClearImage} >Clear</a>
                </CardFooter>
            </CardBody>
        </Card>
    )
  }

  render ({inputName, namespace, options}) {
      const field = this.props.adapter.context
      const isValid = this.props.validationError || this.props.invariantError ? false : undefined

      return <FileUploadWidget
          id={generateId(namespace, '__Field')}
          name={inputName}
          valid={isValid}
          placeholder={renderString(field.placeholder, options && options.lang)}
          readOnly={field.readOnly}
          value={field.toFormattedString(this.state.value)}
          uploadUtilName={field.uploadUtilName}

          onChange={this.didGetChange}>
          {this.props.value && this.renderImage()}
        </FileUploadWidget>
  }
}