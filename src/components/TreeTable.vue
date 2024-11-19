<template>
  <div>
    <button @click="toggleEditMode" class="edit-buttom">
      {{ !editMode ? 'Режим: просмотр' : 'Режим: редактированиe' }}
    </button>
    <div class="history-buttons" v-if="editMode">
      <button>⟲ Назад</button>
      <button>⟳ Вперед</button>
    </div>
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
    ></ag-grid-vue>
  </div>
  <!-- <div>{{ editMode }}</div> -->
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

//https://www.ag-grid.com/vue-data-grid/component-cell-renderer/
const ButtonsComponent = {
  template: '<button>Удалить</button>',
};

export default defineComponent({
  components: {
    AgGridVue,
    ButtonsComponent,
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
        ...item,
        path: getPath(item),
        category: children.length > 0 ? 'Группа' : 'Элемент',
      };
    }

    function getPath(item: any) {
      return store.getAllParents(item.id).map((parent: any) => parent.label);
    }

    function toggleEditMode() {
      editMode.value = !editMode.value;
    }

    const columnDefs = reactive([
      {
        field: 'id',
        headerName: 'No п/п',
        cellDataType: 'text',
      },
      // {
      //   field: 'category',
      //   headerName: 'Категория',
      //   rowGrou: true,
      // },
      {
        field: 'label',
        headerName: 'Наименование',
        // cellRenderer: 'ButtonsComponent',
      },
    ]);

    const autoGroupColumnDef = reactive({
      headerName: 'Категория',
      field: 'category',
      cellRendererParams: { suppressCount: true },
    });

    const rowData = reactive(store.getAll().map(mapRow));

    const groupDefaultExpanded = ref(-1);
    const suppressRowGroupColumns = true;
    const getDataPath = (data: any) => data.path;
    const defaultColDef = ref({
      flex: 1,
      editable: editMode,
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
      toggleEditMode,
    };
  },
});
</script>

<style scoped>
.edit-buttom {
  background: transparent;
  border: none;
  padding: 10px 0px;
  cursor: pointer;
  color: #0096ff;
}
</style>
