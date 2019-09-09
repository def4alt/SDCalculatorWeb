<template>
    <div id="app">
        <div class="container">
            <div class="row col-md-12 d-flex justify-content-center">
                <select-file></select-file>
                <div class="row col-md-12 d-flex justify-content-center">
                    <list-todo></list-todo>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectFile from './SelectFile.vue';
    import ListTodo from './ListTodo.vue';

    export default {
        name: 'app',
        components: { ListTodo, SelectFile},
    }
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0
    }
</style>
