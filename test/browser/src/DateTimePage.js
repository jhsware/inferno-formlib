import { Component } from 'inferno'
import DateTimeFieldWidget from '../../../src/widgets/DateTimeField'
import { DateTimeField } from 'isomorphic-schema'
import { 
    FormText,
    FormGroup,
    Label,
    Row,
    Col
} from 'inferno-bootstrap'

const dateTimeField = new DateTimeField({
    label: 'DateTime Field',
    placeholder: 'Click to select date...',
    help: 'Enter a nice date and time',
    required: true
})

const secondDateTimeField = new DateTimeField({
    label: 'Second DateTime Field',
    placeholder: 'Click to select date...',
    help: 'The popup should point to the correct field',
    required: true
})

export default class Page extends Component {

    constructor (props) {
        super(...arguments)

        this.state = {
            value: undefined,
            validationError: undefined,
            submitted: false
        }
    }

    render () {
        const dummyAdapter = {
            context: dateTimeField
        }

        const secondDummyAdapter = {
            context: secondDateTimeField
        }

        return (
            <div className="TestContainer">
                <h1>DateTime Widget</h1>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label id="dateField">{dateTimeField.label}</Label>
                            <div className="InfernoFormlib-RowFieldContainer">
                                <DateTimeFieldWidget
                                    id="dateField"
                                    doesNotRenderLabel={false}
                                    namespace={['value']}
                                    adapter={dummyAdapter}
                                    onChange={() => null} />
                                {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} /> : null}
                                {dateTimeField.help && <FormText className="text-muted" for="dateField">{dateTimeField.help}</FormText>}
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label id="secondDateField">{secondDateTimeField.label}</Label>
                            <div className="InfernoFormlib-RowFieldContainer">
                                <DateTimeFieldWidget
                                    id="secondDateField"
                                    doesNotRenderLabel={false}
                                    namespace={['secondValue']}
                                    adapter={secondDummyAdapter}
                                    onChange={() => null} />
                                {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} /> : null}
                                {secondDateTimeField.help && <FormText className="text-muted" for="dateField">{secondDateTimeField.help}</FormText>}
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        )
    }
}