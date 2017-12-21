import Component from 'inferno-component'
import { globalRegistry, createUtility } from 'component-registry'
import axios from 'axios'

import { FileUploadWidget } from '../../../lib/widgets/FileUploadWidget'
import { IFileUploadUtil } from '../../../lib/interfaces'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import FormText from 'inferno-bootstrap/lib/Form/FormText'
import FormGroup from 'inferno-bootstrap/lib/Form/FormGroup'
import Label from 'inferno-bootstrap/lib/Form/Label'

import Card from 'inferno-bootstrap/lib/Card/Card'
import CardBody from 'inferno-bootstrap/lib/Card/CardBody'
import CardTitle from 'inferno-bootstrap/lib/Card/CardTitle'
import CardText from 'inferno-bootstrap/lib/Card/CardText'
import CardFooter from 'inferno-bootstrap/lib/Card/CardFooter'
import CardImg from 'inferno-bootstrap/lib/Card/CardImg'


const imageField = new TextField({
    label: 'Image file',
    placeholder: 'Klicka eller dra bild för att ladda upp…',
    help: 'A nice image',
    required: true
})

const imageValue = {
    thumbnailUrl: 'http://www.strategyfocusedhr.com/wp-content/uploads/2017/11/Vacation.jpg',
    title: '4 Companies With Vacation Incentives That\'ll Make You Reconsider'
}

const FileUploadUtil = createUtility({
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

        return axios.post('/imagesAzure', data, config)
            .then((res) => {
                const outp = {}
                Object.assign(outp, imageValue)
                outp.thumbnailUrl = res.data.publicPath
                return Promise.resolve(outp)
            })
            .catch((e) => { throw e })
    }
}).registerWith(globalRegistry)

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
            value: value
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

    render () {
        const dummyAdapter = {
            context: imageField
        }

        return (
            <div className="TestContainer">
                <h1>Date Widget</h1>
                <FormGroup>
                    <Label id="imageField">{imageField.label}</Label>
                    <div className="InfernoFormlib-RowFieldContainer">
                        <FileUploadWidget
                            field={imageField}
                            namespace={['value']}
                            adapter={dummyAdapter}
                            value={this.state.value}

                            onChange={this.didChange}>
                            {this.state.value && this.renderImage()}
                        </FileUploadWidget>
                    </div>
                    {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} /> : null}
                    {imageField.help && <FormText className="text-muted" for="imageField">{imageField.help}</FormText>}
                </FormGroup>
            </div>
        )
    }
}