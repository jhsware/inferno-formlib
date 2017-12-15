'use strict'

import { createInterface } from 'component-registry'

/*

    Form generation components

*/

export const IInputFieldWidget = createInterface({
    // Render the objects schema as a form
    name: 'IInputFieldWidget',
    // Render an object schema as a HTML form
    members: {
        Component: "InfernoComponent"
    }
})

export const IFormRowWidget = createInterface({
    // Render the objects schema as a form
    name: 'IFormRowWidget',
    // Render an object schema as a HTML form
    members: {
        Component: "InfernoComponent"
    }
})

export const ITranslationUtil = createInterface({
    name: 'ITranslationUtil',
    members: {
        // Get a i18n translation
        message: "function"
    }
})

export const IFileUploadUtil = createInterface({
    name: 'IFileUploadUtil',
    members: {
        // Get a i18n translation
        upload: "function(file, progress, done)",
        delete: "function(uri)"
    }
})