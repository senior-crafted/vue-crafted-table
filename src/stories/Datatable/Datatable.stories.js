
import { DatatableExample } from '../../main';

export default { title: 'Deprecated Datatable' };


export const Datatable = () => ({
  components: { DatatableExample },
  template: '<DatatableExample :rounded="true">rounded</DatatableExample>',
});
