<!--eslint-disable-->
<template>
  <div
    class="datatable-block m-0 p-0"
    :style="style"
  >
    <div class="datatable-header-row m-0 p-0 border-bottom">
      <DatatableHeaderCell
        v-for="columnKey in Object.keys(columns)"
        :key="'datatable-header-' + columnKey"
        :table-config="tableConfig"
        :column-id="columnKey"
        :column-config="columns[columnKey]"
        @changeOrder="changeOrder"
      />
    </div>
    <div>
      <div
        v-for="(line, index) in tableData"
        v-if="isVisibleRow(line)"
        class="datatable-data-row border-bottom m-0 p-0"
        :style="rowHeightStyle"
      >
        <DatatableCell
          v-for="columnKey in Object.keys(columns)"
          :key="'datatable-cell-' + columnKey + '-' + index"
          :table-config="tableConfig"
          :column-id="columnKey"
          :column-config="columns[columnKey]"
          :row-data="line"
          @toggleRowDisplay="toggleRowDisplay"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .datatable-block {
        white-space: nowrap;
    }

    .datatable-header-row.border-bottom {
        border-bottom-width: 2px !important;
    }

    .datatable-data-row:nth-child(odd) {
        background-color: #ffffff;
    }

    .datatable-data-row:nth-child(even) {
        background-color: #f5f5f5;
    }
</style>

<script>
/* eslint-disable */
//TODO fix eslint

    import DatatableCell from "./DatatableCell";
    import DatatableHeaderCell from "./DatatableHeaderCell";

    export default {
        props: ['columns', 'closedRows', 'tableConfig', 'tableData', 'width'],
        computed: {
            style() {
                return {
                    width: this.width + 'px',
                };
            },
            rowHeightStyle() {
                return {
                    height: this.tableConfig.rowHeight + 'px',
                };
            },
        },
        methods: {
            changeOrder(columnId) {
                this.$emit('changeOrder', columnId);
            },
            isVisibleRow(line) {
                if (!this.tableConfig.rowParent || line[this.tableConfig.rowParent] == null) {
                    return true;
                }

                let currentParentId = line[this.tableConfig.rowParent];

                //TODO use prepared parents
                while (currentParentId != null) {
                    if (this.tableConfig.closedRows.has(currentParentId)) {
                        return false;
                    }

                    const parentElement = this.tableData.find(
                        (element) => element[this.tableConfig.rowId] === currentParentId
                    );

                    currentParentId = parentElement[this.tableConfig.rowParent];
                }

                return true;
            },
            toggleRowDisplay(id) {
                this.$emit('toggleRowDisplay', id);
            },
        },
        components: {DatatableHeaderCell, DatatableCell},
    };
</script>
