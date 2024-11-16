<template>
  <div>
    <ag-grid-vue
      class="ag-theme-quartz"
      style="height: 500px"
      :rowData="rowData"
      :treeData="true"
      :getDataPath="getDataPath"
      :animateRows="true"
      :columnDefs="columnDefs"
      :groupDefaultExpanded="groupDefaultExpanded"
      :autoGroupColumnDef="autoGroupColumnDef"
      :defaultColDef="defaultColDef"
      :editable="editMode"
      :suppressRowGroupColumns="suppressRowGroupColumns"
    ></ag-grid-vue>
  </div>
  <pre> {{ rowData }}</pre>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import { AgGridVue } from '@ag-grid-community/vue3';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

import TreeStore from '@/store/TreeStore';

export default defineComponent({
  components: {
    AgGridVue,
  },

  setup() {
    const editMode = ref(false);
    const store = new TreeStore([
      { id: 1, parent: null, label: 'Айтем 1' },
      { id: '2', parent: 1, label: 'Айтем 2' },
      { id: 3, parent: 1, label: 'Айтем 3' },
      { id: 4, parent: '2', label: 'Айтем 4' },
      { id: 5, parent: '2', label: 'Айтем 5' },
      { id: 6, parent: '2', label: 'Айтем 6' },
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
    ]);

    function mapRow(item: any) {
      const children = store.getChildren(item.id);
      return {
        path: getPath(item),
        ...item,
        category: children.length > 0 ? 'Группа' : 'Элемент',
      };
    }

    function getPath(item: any) {
      return store.getAllParents(item.id).map((parent: any) => parent.label);
    }

    const columnDefs = reactive([
      {
        field: 'id',
        headerName: 'No п/п',
        cellDataType: 'text',
      },
      {
        field: 'label',
        headerName: 'Наименование',
      },
    ]);

    const rowData = reactive(store.getAll().map(mapRow));

    const groupDefaultExpanded = ref(-1);
    const suppressRowGroupColumns = true;
    const getDataPath = (data: any) => data.path;
    const defaultColDef = ref({
      flex: 1,
    });
    const autoGroupColumnDef = reactive({
      headerName: 'Категория',
      field: 'category',
      cellRendererParams: { suppressCount: true },
    });

    return {
      rowData,
      columnDefs,
      groupDefaultExpanded,
      suppressRowGroupColumns,
      defaultColDef,
      autoGroupColumnDef,
      editMode,
      getDataPath,
      store,
    };
  },
});
</script>

<style scoped></style>
