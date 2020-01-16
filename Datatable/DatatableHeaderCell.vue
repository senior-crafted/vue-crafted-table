<template>
    <div
        v-if="!columnConfig.hidden"
        :style="style"
        class="datatable-cell-header p-2"
        v-html="content"
        @click="changeOrder"
    />
</template>

<style lang="scss" scoped>
    .datatable-cell-header {
        display: inline-block;
        overflow: hidden;
        font-weight: bold;
    }
</style>

<script>
    import cellService from "./datatableService";

    export default {
        props: ['columnConfig', 'tableConfig', 'columnId', 'rowData'],
        computed: {
            content() {
                return typeof this.columnConfig.title === 'undefined' ? this.columnId : this.columnConfig.title;
            },
            style() {
                return cellService.getCellStyle(this.columnConfig, this.tableConfig);
            },
        },
        methods: {
            changeOrder() {
                this.$emit('changeOrder', this.columnId);
            },
        },
        components: {},
    };
</script>
