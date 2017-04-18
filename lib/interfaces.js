'use strict'

import { createInterface } from 'component-registry'

/*

    NOTE: These are basic CMS views. You might not implement these
    for all your objects

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