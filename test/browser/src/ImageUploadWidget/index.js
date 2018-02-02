import { createAdapter, globalRegistry } from 'component-registry'
import { IImageField, ImageField } from './ImageField'
import ImageFieldWidget from './ImageFieldWidget'
import { IInputFieldWidget } from '../../../../lib/interfaces'
import './FileUploadUtil'

createAdapter({
  implements: IInputFieldWidget,
  adapts: IImageField,
  Component: ImageFieldWidget
}).registerWith(globalRegistry)

export {
  IImageField, 
  ImageField,
  ImageFieldWidget
}