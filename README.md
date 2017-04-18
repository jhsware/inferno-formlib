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