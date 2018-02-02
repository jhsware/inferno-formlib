# inferno-formlib
[![Build Status](https://travis-ci.org/jhsware/inferno-formlib.svg?branch=v0.2.24)](https://travis-ci.org/jhsware/inferno-formlib)

The goal of this project is to create a bootstrap 4 compatible form generation library for Inferno.js using isomorphic-schema definitions.

To see form demos:

```sh
$ git clone git@github.com:jhsware/inferno-formlib.git

$ cd inferno-formlib

$ npm i && npm run build-test

$ node test/browser/server.js
``` 

You can now access the examples in your browser at http://localhost:8080

The package generates your form rows and calls an onChange handler whenever the form is updated.

## Installation

```sh
$ npm i -S inferno-formlib isomorphic-schema component-registry
```

To use the components without requiring transpilation you import from the `/dist` directory:

```JavaScript
import { FormRows } from 'inferno-formlib/dist/FormRows'
```
 
You can get a nicer debugging experience by importing your components from the original source code in the `/lib` directory. However this requires that you transpile `node_module/inferno-formlib` imports and add the contents of the .babelrc config file from this repos to your project:

```JavaScript
import { FormRows } from 'inferno-formlib/lib/FormRows'
```

You will find a working webpack.config file in the folder `test/browser`. Don't forget to add your .babelrc
file and babel package devDepencies.

## Form Generation Example
More examples can be found at https://github.com/jhsware/inferno-formlib/tree/master/test/browser/src

You will find some standard form css if you look at https://github.com/jhsware/inferno-formlib/blob/master/test/browser/app.css

Animations are done with https://github.com/jhsware/inferno-animation

```jsx
import Component from 'inferno-component'

// Form schema definition
import { Schema } from 'isomorphic-schema'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import EmailField from 'isomorphic-schema/lib/field_validators/EmailField'
import IntegerField from 'isomorphic-schema/lib/field_validators/IntegerField'
import TextAreaField from 'isomorphic-schema/lib/field_validators/TextAreaField'

// Widgets need to be imported so they can be found by inferno-formlib
// we import them one-by-one to reduce bundle size.
import 'inferno-formlib/dist/widgets/InputField'
import 'inferno-formlib/dist/widgets/TextAreaField'
import 'inferno-formlib/dist/widgets/FormRow'
import { FormRows } from 'inferno-formlib/dist/FormRows'

// Some bootstrap stuff...
import Button from 'inferno-bootstrap/dist/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Form from 'inferno-bootstrap/dist/Form/Form'
import Row from 'inferno-bootstrap/dist/Row'

const formSchema = new Schema('Form Schema', {
  title: new TextField({
    label: 'Title',
    placeholder: 'Type here...',
    required: true
  }),
  email: new EmailField({
    label: 'E-mail',
    placeholder: 'person@email.com',
    required: true
  }),
  age: new IntegerField({
    label: 'Age',
    placeholder: 'i.e. 16',
    required: true
  }),
  bio: new TextAreaField({
    label: 'Bio',
    placeholder: 'Type here...',
    required: true
  })
})

export default class FormSection extends Component {

  constructor (props) {
    super(props)

    this.state = {
        value: {},
        validationError: undefined
    }

    this.didChange = this.didChange.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
  }

  doSubmit (e) {
    e.preventDefault()
    const errors = formSchema.validate(this.state.value)
    this.setState({
      validationError: errors
    })
  }

  didChange (propName, value) {
    const val = this.state.value
    val[propName] = value
    this.setState({
        value: val
    })
    // This is where you would call this.props.onChange
  }

  render () {
    return (
      <Form onSubmit={this.doSubmit}>
        <Row>
          <Col>
            <FormRows schema={formSchema} validationErrors={this.state.validationError} value={this.state.value} onChange={this.didChange} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="submit">Save</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
```

## i18n Support
TODO: Explain how to add i18n support

## Creating a Widget
For now, check the code at https://github.com/jhsware/inferno-formlib/tree/master/test/browser/src/ImageUploadWidget

TODO: Explain how to create a widget.

## Custom Widgets
Custom widgets override whatever standard widget would be rendered for a specific field in form. This is useful
if you want a different behaviour for a field in one specific form.

TODO: Explain how to use a custom widget in a form

## Manually Created Forms
You can see an example of a manually created form at https://github.com/jhsware/inferno-formlib/blob/master/test/browser/src/DatePage.js

TODO: Explain how to use widgets for manual creation of forms

## Transpiling
Make sure you have the following in your .babelrc file (you probably do) and allow transpiling of the inferno-formlib node module:

```json
{
  "presets": ["es2015", "stage-0"],
  "plugins": [
      [
        "babel-plugin-inferno",
        {
          "imports": true
        }
      ]
    ]
}
```
