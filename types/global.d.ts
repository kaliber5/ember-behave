// Types for compiled templates
declare module '@kaliber5/ember-configuration-ui/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
