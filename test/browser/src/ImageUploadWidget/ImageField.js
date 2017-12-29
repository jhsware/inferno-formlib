import { createInterface, createObjectPrototype } from 'component-registry'
import BaseField from 'isomorphic-schema/lib/field_validators/BaseField'
import ImageFieldWidget from './ImageFieldWidget.jsx'

var IImageField = createInterface({
  name: 'IImageField'
})

var ImageField = createObjectPrototype({
  implements: [IImageField],
  extends: [BaseField],

  constructor: function (options) {
    this._IBaseField.constructor.call(this, options);
  }
})

export { IImageField, ImageField }