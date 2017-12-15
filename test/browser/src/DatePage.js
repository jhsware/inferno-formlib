import Component from 'inferno-component'
import DateFieldWidget from '../../../lib/widgets/DateField.jsx'
import DateField from 'isomorphic-schema/lib/field_validators/DateField'
import FormText from 'inferno-bootstrap/lib/Form/FormText'
import FormGroup from 'inferno-bootstrap/lib/Form/FormGroup'
import Label from 'inferno-bootstrap/lib/Form/Label'

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