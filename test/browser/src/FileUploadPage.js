import { Component } from 'inferno'
import { Utility } from 'component-registry'
import axios from 'axios'

import { FileUploadWidget } from '../../../src/widgets/FileUploadWidget'
import { IFileUploadUtil } from '../../../src/interfaces'
import TextField from 'isomorphic-schema/src/field_validators/TextField'
import FormText from 'inferno-bootstrap/src/Form/FormText'
import FormGroup from 'inferno-bootstrap/src/Form/FormGroup'
import Label from 'inferno-bootstrap/src/Form/Label'
import { renderString } from '../../../src/widgets/common'

import Card from 'inferno-bootstrap/src/Card/Card'
import CardBody from 'inferno-bootstrap/src/Card/CardBody'
import CardTitle from 'inferno-bootstrap/src/Card/CardTitle'
import CardText from 'inferno-bootstrap/src/Card/CardText'
import CardFooter from 'inferno-bootstrap/src/Card/CardFooter'
import CardImg from 'inferno-bootstrap/src/Card/CardImg'


const imageField = new TextField({
    label: 'Image file',
    placeholder: 'Klicka eller dra bild för att ladda upp…',
    help: 'A nice image',
    uploadUtilName: 'Image',
    required: true
})

const imageValue = {
    thumbnailUrl: 'http://www.strategyfocusedhr.com/wp-content/uploads/2017/11/Vacation.jpg',
    title: '4 Companies With Vacation Incentives That\'ll Make You Reconsider'
}

const FileUploadUtil = new Utility({
    implements: IFileUploadUtil,
    name: 'Image',

    upload: function (file, onProgress) {
        var config = {
            onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                onProgress(percentCompleted)
            }
        };

        var data = new FormData();
        data.append('file', file);

        return axios.post('/images', data, config)
            .then((res) => {
                const outp = {}
                Object.assign(outp, imageValue)
                outp.thumbnailUrl = res.data.publicPath
                return Promise.resolve(outp)
            })
            .catch((e) => { throw e })
    },

    delete (uri) {
        // TODO: Implement this or go home!
    }
})

    /*
    var mediaApi = registry.getUtility(IFileUploadUtil, this.props.field.utilName || 'Image')
    mediaApi.upload(file, this.onProgress, (err, data) => {
        // TODO: Handle error
        this.props.onChange(this.props.name, data)
    })
    */

export default class Page extends Component {

    constructor (props) {
        super(...arguments)

        this.state = {
            value: imageValue,
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

        // TODO: Call onChange
    }

    didChange (propName, value) {
        this.setState({
            value: imageField.fromString(value)
        })

        // TODO: Call onChange
    }

    renderImage () {
        const image = this.state.value
        return (
            <Card className="ImageField">
                <CardImg width='100%' src={image.thumbnailUrl} />
                <CardBody>
                    <CardTitle>{image.title}</CardTitle>
                    <CardText>
                        Some meta data
                    </CardText>
                    <CardFooter>
                        <a className="ImageField-Action text-danger" href="#clear" onClick={this.doClearImage} >Clear</a>
                    </CardFooter>
                </CardBody>
            </Card>
        )
    }

    render ({inputName, namespace, options}) {
        const isValid = this.state.validationError ? false : undefined

        const value = this.state.value
        const lang = options && options.lang

        return (
            <div className="TestContainer">
                <h1>Image Upload</h1>
                <FormGroup>
                    <Label id="imageField" options={options}>{imageField.label}</Label>
                    <div className="InfernoFormlib-RowFieldContainer">
                        <FileUploadWidget
                            id="value__Field"
                            name="value"
                            valid={isValid}
                            placeholder={renderString(imageField.placeholder, lang, undefined)}
                            options={{parentValue: this.state.value, lang}}
                            readOnly={imageField.readOnly}
                            value={imageField.toFormattedString(this.state.value)}
                            uploadUtilName={imageField.uploadUtilName}
                  
                            onChange={this.didChange}>
                            {this.state.value && this.renderImage()}
                        </FileUploadWidget>
                    </div>
                    {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} options={options} /> : null}
                    {imageField.help && <FormText className="text-muted" for="imageField">{imageField.help}</FormText>}
                </FormGroup>
            </div>
        )
    }
}