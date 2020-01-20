/* eslint-disable */
//TODO fix eslint

export default {
  ACTION_CELL_COLLAPSE: '__datatableActionCellCollapse',
  isServiceColumn(key) {
    if (key === this.ACTION_CELL_COLLAPSE) {
      return true;
    }

    return false;
  },
  getCellStyle(columnConfig, tableConfig) {
    return {
      width: `${columnConfig.realWidth}px`,
      height: `${tableConfig.rowHeight}px`,
    };
  },
  prepareRows(config, sourceData) {
    const result = [];
    for (const row of sourceData) {
      const element = this.prepareRowData(config, sourceData, row);
      result.push(element);
    }

    return result;
  },
  prepareRowData(config, sourceData, element) {
    element.__datatableData = {
      parentIds: config.rowParent ? this.getRowParents(config, sourceData, element) : [],
      childrenIds: config.rowParent ? this.getRowChildren(config, sourceData, element) : [],
    };

    return element;
  },
  getRowChildren(config, tableData, row) {
    return tableData
      .filter((element) => element[config.rowParent] === row[config.rowId])
      .map((element) => element[config.rowId]);
  },
  getRowParents(config, tableData, row) {
    const parentIds = [];
    let currentParentId = row[config.rowParent];

    let depth = 0;
    while (currentParentId != null) {
      parentIds.push(currentParentId);

      const parentElement = tableData.find(
        (element) => element[config.rowId] === currentParentId,
      );

      if (!parentElement) {
        console.error(`Element ID#${currentParentId} not found`);

        return [];
      }

      currentParentId = parentElement[config.rowParent];

      depth++;
      if (depth > 10) {
        console.error('Possible circular reference in parents structure detected');

        return [];
      }
    }

    return parentIds;
  },
  sortTable(config, data, columnId, currentOrderDirectionAsc) {
    if (!config.rowParent) {
      return this.valueSort(data, columnId, currentOrderDirectionAsc);
    }

    const hashArr = [];

    for (let i = 0; i < data.length; i++) {
      const parentId = Number(data[i][config.rowParent]);
      if (hashArr[parentId] === undefined) {
        hashArr[parentId] = [];
      }
      hashArr[parentId].push(data[i]);
    }

    return this.hierarchySort(config.rowId, columnId, currentOrderDirectionAsc, hashArr, 0, []);
  },
  hierarchySort(rowId, columnId, currentOrderDirectionAsc, hashArr, key, result) {
    if (hashArr[key] === undefined) {
      return;
    }

    const arr = this.valueSort(hashArr[key], columnId, currentOrderDirectionAsc);

    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i]);
      this.hierarchySort(rowId, columnId, currentOrderDirectionAsc, hashArr, arr[i][rowId], result);
    }

    return result;
  },
  valueSort(data, columnId, currentOrderDirectionAsc) {
    return data.sort((aItem, bItem) => {
      const a = aItem[columnId];
      const b = bItem[columnId];

      if (a == b) {
        return 0;
      }

      if (currentOrderDirectionAsc) {
        return a > b ? 1 : -1;
      }

      return a > b ? -1 : 1;
    });
  },
  hasChildren(row) {
    return !!row.__datatableData.childrenIds.length;
  },
  importData(datatable, data) {
    const { config } = datatable;

    datatable.tableData = this.prepareRows(config, data);
    datatable.totalRows = datatable.tableData.length;

    datatable.tableData = this.sortTable(
      datatable.config,
      datatable.tableData,
      datatable.config.defaultOrder,
      true,
    );

    datatable.hasPagination = !!datatable.config.hasPagination;

    if (datatable.config.rowParent) {
      datatable.hasPagination = false;
    }

    const perPage = Number(config.perPage);
    datatable.perPage = perPage > 0 ? perPage : 5;

    const rowHeight = Number(config.rowHeight);
    datatable.rowHeight = rowHeight > 0 ? rowHeight : 32;

    const tableHeight = Number(config.tableHeight);
    datatable.tableHeight = tableHeight > 0 ? `${tableHeight}px` : '100%';

    datatable.columnsConfig = {};
    datatable.selectedColumns = [];
    for (const columnKey of Object.keys(config.columns)) {
      datatable.columnsConfig[columnKey] = { ...config.columns[columnKey] };

      datatable.columnsConfig[columnKey].hidden = datatable.columnsConfig[columnKey].hidden || false;

      datatable.columnsConfig[columnKey].width = datatable.columnsConfig[columnKey].width || 100;
      datatable.columnsConfig[columnKey].realWidth = datatable.columnsConfig[columnKey].width;

      if (!datatable.columnsConfig[columnKey].hidden) {
        datatable.selectedColumns.push(columnKey);
      }
    }

    datatable.fixedLeft = datatable.config.fixedLeft || [];

    datatable.isLoaded = true;
  },
};
