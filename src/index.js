'use strict'
import { FormRows } from './dist/FormRows'

import AutoCompleteWidget from './dist/widgets/AutoComplete'
import AnyOfWidget from './dist/widgets/AnyOf'
import CheckboxWidget from './dist/widgets/BoolField'
import DynamicSelectWidget from './dist/widgets/DynamicSelectField'
import InputWidget from './dist/widgets/InputField'
import ListWidget from './dist/widgets/ListField'
import MultiSelectWidget from './dist/widgets/MultiSelectField'
import ObjectWidget from './dist/widgets/ObjectField'
import PasswordWidget from './dist/widgets/PasswordField'
import SelectWidget from './dist/widgets/SelectField'
import TextAreaWidget from './dist/widgets/TextAreaField'
import SelectAsyncBaseWidget from './dist/widgets/SelectAsyncBaseWidget'
import { FileUploadWidget, ProgressOverlay } from './dist/widgets/FileUploadWidget'

import CustomWidget from './dist/CustomWidget'

import './dist/widgets/FormRow'

import interfaces from './dist/interfaces'

module.exports = {
    CustomWidget,
    FormRows,
    interfaces,
    widgets: {
        AutoCompleteWidget,
        AnyOfWidget,
        CheckboxWidget,
        DynamicSelectWidget,
        FileUploadWidget,
        InputWidget,
        ListWidget,
        MultiSelectWidget,
        ObjectWidget,
        PasswordWidget,
        SelectWidget,
        TextAreaWidget,
        SelectAsyncBaseWidget,

        ProgressOverlay
    } 
}
