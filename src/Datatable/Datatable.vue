<template>
  <div>
    <div
      v-if="!isLoaded"
      ref="datatable"
      class="card p-0 border text-center"
    >
      <div class="spinner-border text-primary" />
    </div>

    <select
      v-if="isLoaded"
      v-model="selectedColumns"
      multiple="multiple"
      size="6"
      @change="toggleColumnVisibility()"
    >
      <option
        v-for="columnKey in Object.keys(columnsConfig)"
        :key="columnKey"
        :style="isServiceColumn(columnKey) ? {display: 'none'} : {}"
        :value="columnKey"
      >
        {{ columnKey }}
      </option>
    </select>

    <div
      v-if="isLoaded"
      ref="datatable"
      class="datatable-block-container card p-0 border"
      :style="style"
    >
      <div
        v-if="fixedLeft.length > 0"
        class="datatable-block datable-block-fixed-left"
      >
        <DatatableBlock
          :columns="getLeftBlockColumns"
          :table-config="getTableConfig"
          :table-data="getCurrentPageData()"
          :width="getLeftBlockWidth"
          @changeOrder="changeOrder"
          @toggleRowDisplay="toggleRowDisplay"
        />
      </div>

      <div class="datatable-block datable-block-center">
        <DatatableBlock
          :columns="getCenterBlockColumns"
          :table-config="getTableConfig"
          :table-data="getCurrentPageData()"
          :width="getCenterBlockWidth"
          @changeOrder="changeOrder"
          @toggleRowDisplay="toggleRowDisplay"
          @updateDatatableWidth="updateDatatableWidth"
        />
      </div>
    </div>

    <b-pagination
      v-if="hasPagination"
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    />
  </div>
</template>

<style lang="scss" scoped>
    .datatable-block-container {
        overflow-x: auto;
    }

    .datatable-block-container:after {
        clear: both;
    }

    .datatable-block {
        float: left;
    }
</style>

<script>
/* eslint-disable */
//TODO fix eslint

    import DatatableBlock from './DatatableBlock';
import datatableService from './datatableService';

export default {
  components: { DatatableBlock },
  props: ['config'],
  data() {
    return {
      isLoaded: false,
      realTableWidth: 0,
      columnsConfig: [],
      tableData: [],
      closedRows: new Map(),
      hasPagination: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      fixedLeft: [],
      selectedColumns: [],
      rowHeight: 32,
      tableHeight: '100%',
      currentOrderColumn: null,
      currentOrderDirectionAsc: true,
    };
  },
  computed: {
    style() {
      return {
        height: this.tableHeight,
      };
    },
    getTableConfig() {
      return {
        rowHeight: this.rowHeight,
        rowId: this.config.rowId,
        rowParent: this.config.rowParent,
        closedRows: this.closedRows,
      };
    },
    getCenterBlockColumns() {
      const result = {};

      for (const columnKey of Object.keys(this.columnsConfig)) {
        if (this.fixedLeft.includes(columnKey) || this.columnsConfig[columnKey].hidden) {
          continue;
        }

        result[columnKey] = this.columnsConfig[columnKey];
      }

      return result;
    },
    getLeftBlockColumns() {
      const result = {};

      for (const columnKey of Object.keys(this.columnsConfig)) {
        if (!this.fixedLeft.includes(columnKey) || this.columnsConfig[columnKey].hidden) {
          continue;
        }

        result[columnKey] = this.columnsConfig[columnKey];
      }

      return result;
    },
    getLeftBlockWidth() {
      let total = 0;
      for (const columnKey of Object.keys(this.getLeftBlockColumns)) {
        total += this.getLeftBlockColumns[columnKey].realWidth;
      }

      return total;
    },
    getCenterBlockWidth() {
      let total = 0;
      for (const columnKey of Object.keys(this.getCenterBlockColumns)) {
        total += this.getCenterBlockColumns[columnKey].realWidth;
      }

      return total;
    },
  },
  mounted() {
    switch (true) {
      case typeof this.config.dataSource === 'function':
        this
          .config
          .dataSource()
          .then((response) => {
            datatableService.importData(this, response.data);
            this.updateDatatableWidth();
          })
          .catch((err) => {
            // TODO display error
            console.log(err);
          });
        break;
      case this.config.dataSource instanceof Array:
        datatableService.importData(this, this.config.dataSource);
        this.updateDatatableWidth();
        break;
      default:
                    // TODO display error
    }
  },
  methods: {
    updateDatatableWidth() {
      this.realTableWidth = this.$refs.datatable.clientWidth;

      let columnsWidth = 0;
      for (const columnKey of Object.keys(this.columnsConfig)) {
        if (this.columnsConfig[columnKey].hidden) {
          continue;
        }
        columnsWidth += this.columnsConfig[columnKey].width;
      }

      if (columnsWidth >= this.realTableWidth) {
        this.columnsConfig = { ...this.columnsConfig };

        return;
      }

      let remainingWidth = this.realTableWidth;
      const proportion = this.realTableWidth / columnsWidth;
      for (const columnKey of Object.keys(this.columnsConfig)) {
        if (this.columnsConfig[columnKey].hidden) {
          continue;
        }
        const width = Math.round(this.columnsConfig[columnKey].width * proportion);
        this.columnsConfig[columnKey].realWidth = Math.min(width, remainingWidth);
        remainingWidth -= this.columnsConfig[columnKey].realWidth;
      }

      this.columnsConfig = { ...this.columnsConfig };
    },
    getCurrentPageData() {
      if (!this.hasPagination) {
        return this.tableData;
      }

      const start = (this.currentPage - 1) * this.perPage;

      return this.tableData.slice(start, start + this.perPage);
    },
    toggleColumnVisibility() {
      for (const columnKey of Object.keys(this.columnsConfig)) {
        let isHidden = true;
        if (this.selectedColumns.includes(columnKey)) {
          isHidden = false;
        }

        this.columnsConfig[columnKey].hidden = isHidden;
      }

      this.updateDatatableWidth();
    },
    changeOrder(columnId) {
      if (this.currentOrderColumn === columnId) {
        this.currentOrderDirectionAsc = !this.currentOrderDirectionAsc;
      } else {
        this.currentOrderDirectionAsc = true;
        this.currentOrderColumn = columnId;
      }

      this.tableData = datatableService.sortTable(
        this.config,
        this.tableData,
        columnId,
        this.currentOrderDirectionAsc,
      );
    },
    toggleRowDisplay(id) {
      if (this.closedRows.has(id)) {
        this.closedRows.delete(id);
      } else {
        this.closedRows.set(id, true);
      }

      this.closedRows = new Map(this.closedRows);
    },
    isServiceColumn(key) {
      return datatableService.isServiceColumn(key);
    },
  },
};
</script>
