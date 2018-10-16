import { Component } from 'inferno'
import DateFieldWidget from '../../../src/widgets/DateField'
import DateField from 'isomorphic-schema/src/field_validators/DateField'
import FormText from 'inferno-bootstrap/src/Form/FormText'
import FormGroup from 'inferno-bootstrap/src/Form/FormGroup'
import Label from 'inferno-bootstrap/src/Form/Label'

const dateField = new DateField({
    label: 'Date Field',
    placeholder: 'yyyy-mm-dd',
    help: 'Enter a nice date',
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
            context: dateField
        }

        return (
            <div className="TestContainer">
                <h1>Date Widget</h1>
                <FormGroup>
                    <Label id="dateField">{dateField.label}</Label>
                    <div className="InfernoFormlib-RowFieldContainer">
                        <DateFieldWidget
                            namespace={['value']}
                            adapter={dummyAdapter}
                            onChange={() => null} />
                    </div>
                    {this.state.validationError ? <ErrorMsg validationError={this.state.validationError} submitted={this.state.submitted} /> : null}
                    {dateField.help && <FormText className="text-muted" for="dateField">{dateField.help}</FormText>}
                </FormGroup>
            </div>
        )
    }
}