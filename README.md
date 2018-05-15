# inferno-formlib
[![Build Status](https://travis-ci.org/jhsware/inferno-formlib.svg?branch=v0.2.24)](https://travis-ci.org/jhsware/inferno-formlib)

The goal of this project is to create a bootstrap 4 compatible form generation library for Inferno.js using isomorphic-schema definitions.

## Compatibility
inferno-formlib 5.x supports Inferno v5

inferno-formlib 4.x supports Inferno v4

inferno-formlib 3.x supports Inferno v3

## Exampe With Sticky Action Bar
This is the basic anatomy of a form generated with inferno-formlib. It can generate nested forms from isomorphic-schema form definitions and list fields support drag'n'drop reordering.

Currently the DateTimeField widget hasn't been implemented, but it is in the pipeline.

```JavaScript
import { Component } from 'inferno'

// Imports to define form schema
import { Schema } from 'isomorphic-schema'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import DateField from 'isomorphic-schema/lib/field_validators/DateField'

// Register widgets
import 'inferno-formlib/dist/widgets/InputField'
import 'inferno-formlib/dist/widgets/DateField'

// Form generation
import { FormRows } from 'inferno-formlib'
import { ActionBar } from 'inferno-formlib/dist/widgets/ActionBar'

// Some useful Bootstrap components
import Form from 'inferno-bootstrap/dist/Form/Form'
import Button from 'inferno-bootstrap/dist/Button'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'

const formSchema = new Schema('Form Schema', {
    title: new TextField({
      label: 'Race Name' 
    }),
    startDate: new DateField({
      label: 'Start Date'
    })
  })
})

class FormEdit extends Component {
  constructor (props) {
    super(props)

    this.didChange = this.didChange.bind(this)
    this.doSubmit = this.doSubmit.bind(this)

    this.state = {
      validationErrors: undefined,
      isMounted: false, // Prevents animations on mounting of form
      value: {}
    }
  }

  componentDidMount () {
    this.setState({
      isMounted: true
    })
  }

  didChange (propName, value) {
    const newValue = this.state.value
    newValue[propName] = value
    this.setState({
      value: newValue
    })
  }

  doSubmit (e) {
    e.preventDefault()
    const validationErrors = formSchema.validate(this.state.value)
    this.setState({
      validationErrors
    })

    if (validationErrors === undefined) {
      // TODO: Submit form to API
    } else {
      // TODO: Show error message
    }
  }

  render () {
    return (
      <Form onSubmit={this.doSubmit}>
        <Row>
          <Col>
            <h2>My Form</h2>
          </Col>
        </Row>

        <FormRows
          schema={formSchema}
          validationErrors={this.state.validationErrors}
          value={this.state.value}
          isMounted={this.state.isMounted}
          onChange={this.didChange}
         />

        <ActionBar boundary={{top: 0, bottom: 0}}>
          <Row>
              <Col>
                <Button type="submit" color="success">Save</Button>
              </Col>
          </Row>
        </ActionBar>
      </Form>
    )
  }
}
```

```CSS
.InfernoFormlib-ActionBar {
    background-color: rgba(255,255,255,0.8);
    z-index: 1;
    padding: 0.5rem 1rem;
    width: 100%;
    border-top: 1px solid #777;
}
.InfernoFormlib-StickyActionBar {
    position: fixed;
}
.InfernoFormlib-ActionBar--hidden {
    visibility: hidden;
}
.InfernoFormlib-StickyActionBar--hidden {
    display: none;
}

```

## Form Demos

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

## Another Example
More examples can be found at https://github.com/jhsware/inferno-formlib/tree/master/test/browser/src

You will find some standard form css if you look at https://github.com/jhsware/inferno-formlib/blob/master/test/browser/app.css

Animations are done with https://github.com/jhsware/inferno-animation

```jsx
import { Component } from 'inferno'

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

## Customising How Rows are Rendered
This example shows how you create a character limit counter for text fields. You do this by customising how the row is rendered by means of a row widget adapter. The row widget adapter is registered in the globalRegistry and will override the existing generic row widget used to render text input fields.

Note that this approach will override the look and feel of all TextField rows.

```JavaScript
import { Component } from 'inferno'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces, i18n } from 'isomorphic-schema'
import { IFormRowWidget }  from 'inferno-formlib/dist/interfaces'

import { ErrorMsg, HelpMsg, Label } from 'inferno-formlib/dist/widgets/FormRow'
import { animateOnAdd, animateOnRemove } from 'inferno-animation'
import FormText from 'inferno-bootstrap/dist/Form/FormText'
import FormGroup from 'inferno-bootstrap/dist/Form/FormGroup'

import { renderString } from 'inferno-formlib/dist/widgets/common'

function CharsLeft (props) {
  const outp = renderString(i18n('isomorphic-schema--field_charactersLeft'), props.options && props.options.lang, `Tecken kvar: ${props.charsLeft}`)
  const color = (props.charsLeft < 0 ? 'danger' : undefined)

  return <FormText muted color={color} className="CharsLeft" for={props.id}>{outp}</FormText>
}

/*
    PROPS:
    - animation: animation css class prefix
    - submitted: bool, has been submitted
    - field:  isomorphic-schema field validator object
    - errors: isomorphic-schema field and server error object { fieldErrors, serverErrors } or undefined if no errors
    - id:     unique id of field
*/
class Row extends Component {
  // TODO: Add animation support

  // support required
  componentDidMount () {
      if (this.props.formIsMounted) {
          animateOnAdd(this.$V.dom, 'InfernoFormlib-Row--Animation')
      }
  }

  componentWillUnmount () {
      animateOnRemove(this.$V.dom, 'InfernoFormlib-Row--Animation')
  }

  render () {
    const field = this.props.adapter.context
    const value = this.props.value

    const color = (this.props.validationError ? 'danger' : undefined)

    let charsLeft
    if (field._maxLength) {
      charsLeft = (typeof value === 'string' ? field._maxLength - value.length : field._maxLength)
    }

    return (
      <FormGroup id={this.props.namespace.join('.') + '__Row'} color={color}>
        {field.label && <Label id={this.props.id}>{field.label}</Label>}
        <div className="InfernoFormlib-RowFieldContainer">
            {this.props.children}
        </div>
        {this.props.validationError ? <ErrorMsg validationError={this.props.validationError} submitted={this.props.submitted} /> : null}
        {(charsLeft !== undefined) && <CharsLeft charsLeft={charsLeft} />}
        {field.help && <HelpMsg text={field.help} required={field._isRequired} />}
      </FormGroup>
    )
  }
}

createAdapter({
  implements: IFormRowWidget,
  adapts: interfaces.ITextField,
  
  Component: Row
}).registerWith(globalRegistry)

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
