import { globalRegistry } from 'component-registry'
import { IInputFieldWidget, IFormRowWidget }  from './interfaces'

export default function (field, propPath, customWidgetsDict) {

    let InputFieldAdapter, RowAdapter

    if (customWidgetsDict.hasOwnProperty(propPath)) {
      // Check if a custom widget has been provided, in which case call it
      /*
        <FormRows schema={formSchema} validationErrors={this.state.errors} value={this.state.value} onChange={this.didUpdate}>
          <CustomWidget propPath="user.title" fieldWidget={InputWidget} rowWidget={RowWidget} />
          <CustomWidget propPath="first_name" fieldWidget={InputWidget} rowWidget={RowWidget} />
        </FormRows>
        }
      */

      // TODO: Custom widget in list field
      // TODO: Custom widget in object field
      // TODO: Put this in utility function
      if (customWidgetsDict[propPath].fieldWidget) {
        // Mock adapter instance
        InputFieldAdapter = {
          context: field,
          Component: customWidgetsDict[propPath].fieldWidget
        }
      }

      if (customWidgetsDict[propPath].rowWidget) {
        // Mock adapter instance
        RowAdapter = {
          context: field,
          Component: customWidgetsDict[propPath].rowWidget
        }
      }
    }
    
    // TODO: Support readOnly
    if (!InputFieldAdapter) InputFieldAdapter = globalRegistry.getAdapter(field, IInputFieldWidget)
    if (!RowAdapter) RowAdapter = globalRegistry.getAdapter(field, IFormRowWidget)

    return {
      InputFieldAdapter,
      RowAdapter
    }
}