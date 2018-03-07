import { Component } from 'inferno'
import { globalRegistry } from 'component-registry'
import { FileUploadWidget } from '../../../../lib/widgets/FileUploadWidget'
import { IFileUploadUtil } from '../../../../lib/interfaces'
import { renderString } from '../../../../lib/widgets/common'

import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'
import CardImg from 'inferno-bootstrap/lib/Card/CardImg'

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

  render () {
      const field = this.props.adapter.context
      const isValid = this.props.validationError ? false : undefined

      return <FileUploadWidget
          id={this.props.namespace.join(".") + "__Field"}
          name={this.props.inputName}
          valid={isValid}
          placeholder={renderString(field.placeholder)}
          readOnly={field.readOnly}
          value={field.toFormattedString(this.state.value)}
          uploadUtilName={field.uploadUtilName}

          onChange={this.didGetChange}>
          {this.props.value && this.renderImage()}
        </FileUploadWidget>
  }
}