import { Adapter } from 'component-registry'
import { IImageField, ImageField } from './ImageField'
import ImageFieldWidget from './ImageFieldWidget'
import { IInputFieldWidget } from '../../../../src/interfaces'
import './FileUploadUtil'

new Adapter({
  implements: IInputFieldWidget,
  adapts: IImageField,
  Component: ImageFieldWidget
})

export {
  IImageField, 
  ImageField,
  ImageFieldWidget
}