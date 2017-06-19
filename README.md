# inferno-formlib
The goal of this project is to create a bootstrap compatible form generation library for Inferno.js using isomorphic-schema definitions.


### TODO
TODO: Create solution for AnyOf widget

### DEV NOTES
```jsx
<Form schema={mySchema} onChange={}>
  <div>
    <Field name="yada" />
    <Field name="woop" />
  </div>
  <Field name="weep.wey" />
  <WinkleField name="winkle" />  // Custom field widget
</Form>





<Form schema={mySchema} onChange={}>
  <FormFields omitFields="" || selectFields="">
    <WinkleField name="winkle" /> // Custom field widget
  </FormFields>
</Form>





<Form schema={mySchema} onChange={}>
  <FormFields />
</Form>

<ActionBar message={} onSubmit={} onCancel={} />
```

```json
  "// babel": "Babel presets in package.json so they are applied to symlinked packages https://github.com/babel/babel-loader/issues/149",
  "babel": {
    "env": {
      "development": {
        "presets": [
          "es2015",
          "stage-0"
        ]
      }
    },
    "plugins": [
      "transform-decorators-legacy",
      "transform-runtime",
      "babel-plugin-syntax-jsx",
      [
        "babel-plugin-inferno",
        {
          "imports": true
        }
      ]
    ]
  }
  ```

## i18n strings
```
InfernoFormlib-i18n-required -- string showing field is required
```