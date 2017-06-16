'use strict'
var FormRows = require('./dist/FormRows').FormRows

var AutoCompleteWidget = require('./dist/widgets/AutoComplete').default
var AnyOfWidget = require('./dist/widgets/AnyOf').default
var CheckboxWidget = require('./dist/widgets/BoolField').default
var DynamicSelectWidget = require('./dist/widgets/DynamicSelectField').default
var InputWidget = require('./dist/widgets/InputField').default
var ListWidget = require('./dist/widgets/ListField').default
var MultiSelectWidget = require('./dist/widgets/MultiSelectField').default
var ObjectWidget = require('./dist/widgets/ObjectField').default
var PasswordWidget = require('./dist/widgets/PasswordField').default
var SelectWidget = require('./dist/widgets/SelectField').default
var TextAreaWidget = require('./dist/widgets/TextAreaField').default
var SelectAsyncBaseWidget = require('./dist/widgets/SelectAsyncBaseWidget').default

var CustomWidget = require('./dist/CustomWidget').default

require('./dist/widgets/FormRow')

module.exports = {
    CustomWidget,
    FormRows,
    interfaces: require('./dist/interfaces'),
    widgets: {
        AutoCompleteWidget,
        AnyOfWidget,
        CheckboxWidget,
        DynamicSelectWidget,
        InputWidget,
        ListWidget,
        MultiSelectWidget,
        ObjectWidget,
        PasswordWidget,
        SelectWidget,
        TextAreaWidget,
        SelectAsyncBaseWidget
    } 
}
