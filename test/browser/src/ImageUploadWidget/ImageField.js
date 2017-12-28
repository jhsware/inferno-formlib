import { createInterface, createObjectPrototype, createAdapter, globalRegistry } from 'component-registry'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
const { IInputFieldWidget } = require('inferno-formlib/lib/interfaces')
import ImageFieldWidget from '../../components/ImageFieldWidget.jsx'

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