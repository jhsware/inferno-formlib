'use strict'
import { FormRows } from './FormRows'

import AutoCompleteWidget from './widgets/AutoComplete'
import AnyOfWidget from './widgets/AnyOf'
import CheckboxWidget from './widgets/BoolField'
import DynamicSelectWidget from './widgets/DynamicSelectField'
import InputWidget from './widgets/InputField'
import ListWidget from './widgets/ListField'
import MultiSelectWidget from './widgets/MultiSelectField'
import ObjectWidget from './widgets/ObjectField'
import PasswordWidget from './widgets/PasswordField'
import SelectWidget from './widgets/SelectField'
import TextAreaWidget from './widgets/TextAreaField'
import SelectAsyncBaseWidget from './widgets/SelectAsyncBaseWidget'
import { FileUploadWidget, ProgressOverlay } from './widgets/FileUploadWidget'

import CustomWidget from './CustomWidget'

import './widgets/FormRow'

import * as interfaces from './interfaces'

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
