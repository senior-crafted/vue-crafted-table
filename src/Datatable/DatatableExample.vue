<template>
  <div class="row">
    <div class="col-12">
      <div class="card p-3">
        <Datatable :config="articlesConfig" />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
//TODO fix eslint
    import Datatable from './Datatable.vue';
import datatableService from './datatableService';

const data = [
  {
    id: 1, col1: 5, col2: 'cc p0 ------- test', parent: null,
  },
  {
    id: 2, col1: 15, col2: 'aa p1 - test asdsa', parent: 1,
  },
  {
    id: 3, col1: 5555, col2: 'bb p1 - terewreewrerwewr ewr st', parent: 1,
  },
  {
    id: 4, col1: 4999, col2: 'ab p2 - amass', parent: 2,
  },
  {
    id: 5, col1: 99439, col2: 'ac p2 - aamasdgfss', parent: 2,
  },
  {
    id: 6, col1: 999, col2: 'aaamass', parent: null,
  },
  {
    id: 7, col1: 9939, col2: 'abmasdfgss', parent: null,
  },
  {
    id: 8, col1: 99679, col2: 'bbmass', parent: null,
  },
  {
    id: 9, col1: 34999, col2: 'ccmassdfgs', parent: null,
  },
  {
    id: 10, col1: 4999, col2: 'mass', parent: null,
  },
  {
    id: 11, col1: 5999, col2: 'mass', parent: null,
  },
  {
    id: 12, col1: 999, col2: 'maghjgfss', parent: null,
  },
  {
    id: 13, col1: 9939, col2: 'mass', parent: null,
  },
  {
    id: 14, col1: 999, col2: 'majdjdfgss', parent: null,
  },
  {
    id: 15, col1: 4999, col2: 'mass', parent: null,
  },
  {
    id: 16, col1: 33999, col2: 'mass', parent: null,
  },
  {
    id: 17, col1: 999, col2: 'mafghfghgss', parent: null,
  },
  {
    id: 18, col1: 76999, col2: 'mass', parent: null,
  },
  {
    id: 19, col1: 999, col2: 'masdfghfdgs', parent: null,
  },
  {
    id: 20, col1: 945499, col2: 'mass', parent: null,
  },
  {
    id: 21, col1: 999, col2: 'mas5345345345s', parent: null,
  },
  {
    id: 22, col1: 999, col2: 'mass', parent: null,
  },
];

// for (let i = 0; i < 500; i++) {
//     data.push({id: 5000 + i, col1: 1000 + i, col2: 'generated ' + i, parent: null});
// }

const articlesConfig = {
  columns: {
    [datatableService.ACTION_CELL_COLLAPSE]: {
      hidden: false,
      width: 40,
      title: '',
    },
    col1: {
      hidden: false,
      width: 80,
    },
    col2: {
      hidden: false,
      title: '<i>Label</i>',
      width: 600,
      display(row) {
        return '&nbsp;'.repeat(4 * row.__datatableData.parentIds.length) + row.col2;
      },
    },
    col3: {
      hidden: false,
      display(row) {
        return `<b>${row.col1 * 2}</b>`;
      },
      width: 80,
    },
    col4: {
      hidden: true,
      display(row) {
        return `<b>${row.col1 * 2}</b>`;
      },
      width: 80,
    },
    col5: {
      hidden: true,
      display(row) {
        return `<b>${row.col1 * 2}</b>`;
      },
      width: 80,
    },
    col6: {
      hidden: false,
      display(row) {
        return `<i>!!!${row.col1 * 3}!!!</i>`;
      },
      width: 80,
    },
  },
  dataSource: data,
  // dataSource: () => {
  //   const url = '/testdata.json';
  //
  //   return axios.get(url);
  // },
  // hasPagination: true,
  // perPage: 10,
  // fixedLeft: ['col1', 'col2'],
  rowId: 'id',
  rowParent: 'parent',
  // rowHeight: 50,
  // tableHeight: 250,
  defaultOrder: 'col2',
};

export default {
  components: {
    Datatable,
  },
  props: [],
  data() {
    return {
      articlesConfig,
    };
  },
  computed: {},
  methods: {},
};
</script>
