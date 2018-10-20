import { Component } from 'inferno'
import DateFieldWidget from '../../../src/widgets/DateField'
import { DateField } from 'isomorphic-schema'
import {
    FormText,
    FormGroup,
    Label
} from 'inferno-bootstrap'

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