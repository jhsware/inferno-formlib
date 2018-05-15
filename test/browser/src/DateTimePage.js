import { Component } from 'inferno'
import DateTimeFieldWidget from '../../../lib/widgets/DateTimeField'
import DateTimeField from 'isomorphic-schema/lib/field_validators/DateTimeField'
import FormText from 'inferno-bootstrap/lib/Form/FormText'
import FormGroup from 'inferno-bootstrap/lib/Form/FormGroup'
import Label from 'inferno-bootstrap/lib/Form/Label'

const dateTimeField = new DateTimeField({
    label: 'DateTime Field',
    help: 'Enter a nice date and time',
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

        return (
            <div className="TestContainer">
                <h1>Date Widget</h1>
                <FormGroup>
                    <Label id="dateField">{dateTimeField.label}</Label>
                    <div className="InfernoFormlib-RowFieldContainer">
                        <DateTimeFieldWidget
                            namespace={['value']}
                            adapter={dummyAdapter}
                            onChange={() => null} />
                    </div>
                    {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} /> : null}
                    {dateTimeField.help && <FormText className="text-muted" for="dateField">{dateTimeField.help}</FormText>}
                </FormGroup>
            </div>
        )
    }
}