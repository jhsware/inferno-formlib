import { createInterface, createObjectPrototype, createAdapter, globalRegistry } from 'component-registry'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import { IInputFieldWidget } from '../../../../lib/interfaces'
import ImageFieldWidget from './ImageFieldWidget.jsx'

var IImageField = createInterface({
  name: 'IImageField'
})

var ImageField = createObjectPrototype({
  implements: [IImageField],
  extends: [TextField]
})

createAdapter({
  implements: IInputFieldWidget,
  adapts: IImageField,
  Component: ImageFieldWidget
}).registerWith(globalRegistry)

export { IImageField, ImageField }