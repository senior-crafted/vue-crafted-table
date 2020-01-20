<!--eslint-disable-->

<template>
  <div
    v-if="!columnConfig.hidden"
    :style="style"
    class="datatable-cell datatable-cell-data p-1"
  >
    <div
      v-if="!isServiceColumn"
      v-html="content"
    />
    <div v-if="isCollapseColumn && hasChildren">
      <button
        v-if="!tableConfig.closedRows.has(rowData[tableConfig.rowId])"
        class="btn btn-clear text-primary p-0 shadow-none"
        @click="toggleRowDisplay(rowData[tableConfig.rowId])"
      >
        <b-icon icon="chevron-down" />
      </button>
      <button
        v-if="tableConfig.closedRows.has(rowData[tableConfig.rowId])"
        class="btn btn-clear text-primary p-0 shadow-none"
        @click="toggleRowDisplay(rowData[tableConfig.rowId])"
      >
        <b-icon icon="chevron-right" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .datatable-cell {
        display: inline-block;
        overflow: hidden;
    }
</style>

<script>
import datatableService from './datatableService';
// TODO fix eslint

/* eslint-disable */

    export default {
        props: ['columnConfig', 'tableConfig', 'columnId', 'rowData'],
        computed: {
            content() {
                if (typeof this.columnConfig.display === 'function') {
                    return this.columnConfig.display(this.rowData);
                }

                return this.rowData[this.columnId];
            },
            style() {
                return datatableService.getCellStyle(this.columnConfig, this.tableConfig);
            },
            isServiceColumn() {
                return datatableService.isServiceColumn(this.columnId);
            },
            isCollapseColumn() {
                return this.columnId === datatableService.ACTION_CELL_COLLAPSE;
            },
            hasChildren() {
                return datatableService.hasChildren(this.rowData);
            }
        },
        methods: {
            toggleRowDisplay(id) {
                this.$emit('toggleRowDisplay', id);
            },
        },
        components: {},
    };
</script>
