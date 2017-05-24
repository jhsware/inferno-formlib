var FormRows = require('./dist/FormRows').FormRows

var InputField = require('./dist/widgets/InputField').default 
require('./dist/widgets/BoolField')
require('./dist/widgets/PasswordField')
require('./dist/widgets/TextAreaField')
require('./dist/widgets/ObjectField')
require('./dist/widgets/ListField')
require('./dist/widgets/FormRow')
require('./dist/widgets/SelectField')
require('./dist/widgets/MultiSelectField')
require('./dist/widgets/AnyOf')

module.exports = {
    FormRows: FormRows,
    interfaces: require('./dist/interfaces'),
    widgets: {
        InputField: InputField
    } 
}
