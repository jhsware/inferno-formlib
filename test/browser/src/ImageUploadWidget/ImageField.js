import { createInterfaceClass, createObjectPrototype } from 'component-registry'
const Interface = createInterfaceClass('inferno-formlib')
import { BaseField } from 'isomorphic-schema'

var IImageField = new Interface({
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
