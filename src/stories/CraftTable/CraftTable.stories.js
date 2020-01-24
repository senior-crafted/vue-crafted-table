import {
  CraftTable, CraftTableRow, CraftTableCol, CraftTableHeaderCol,
} from '../../main';


export default { title: 'Get Started' };


export const Datatable = () => ({
  components: {
    CraftTable,
    CraftTableRow,
    CraftTableCol,
    CraftTableHeaderCol,
  },
  template: `<CraftTable>
    <CraftTableRow>
      <CraftTableHeaderCol>test1</CraftTableHeaderCol>
      <CraftTableHeaderCol>test</CraftTableHeaderCol>
      <CraftTableHeaderCol>test</CraftTableHeaderCol>
    </CraftTableRow>   
    <CraftTableRow>
      <CraftTableCol>test</CraftTableCol>
      <CraftTableCol>test</CraftTableCol>
      <CraftTableCol>test</CraftTableCol>
  </CraftTableRow>
  </CraftTable>`,
});
