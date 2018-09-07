'use strict'

import { createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('inferno-formlib')

/*

    Form generation components

*/

export const IInputFieldWidget = new Interface({
    // Render the objects schema as a form
    name: 'IInputFieldWidget'
})
// Render an object schema as a HTML form
IInputFieldWidget.prototype.Component = 'object'

export const IFormRowWidget = new Interface({
    // Render the objects schema as a form
    name: 'IFormRowWidget'
})
// Render an object schema as a HTML form
IFormRowWidget.prototype.Component = 'object'

export const IListRowContainerWidget = new Interface({
    // Render the objects schema as a form
    name: 'IListRowContainerWidget'
})
// Render an object schema as a HTML form
IListRowContainerWidget.prototype.Component = 'object'

export const ITranslationUtil = new Interface({
    name: 'ITranslationUtil'
})
// Get a i18n translation
ITranslationUtil.prototype.message = function () {}

export const IFileUploadUtil = new Interface({
    name: 'IFileUploadUtil'
})
// Upload file to blob storage
IFileUploadUtil.prototype.upload = function (file, progress, done) {}
// Delete file from blob storage (TODO: Is this the right way?)
IFileUploadUtil.prototype.delete = function (uri) {}

export const IDraggableController = new Interface({
    // This utility is looked up by name. The name is passed by
    // the dropping actor
    name: 'IDraggableController'
})
// Create an object based on dragged data
IDraggableController.prototype.getObject = function (data) {}
// Check if we can drop source on target
IDraggableController.prototype.mayDrop = function (source, target) {}
