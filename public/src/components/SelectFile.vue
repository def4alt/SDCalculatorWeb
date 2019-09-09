<template>
  <div>
    <h2>Create a Todo List</h2>
    <form @submit.prevent>
      <div class="form-group">
        <label>
          Upload
          <input type="file" multiple ref="fileSelector" v-on:change="fileSelected" />
        </label>
        <button class="button" v-on:click="calculate">Calculate</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";
import CalculateSD from './../js/calculator'
import SampleType from './../models/SampleType'

export default {
  data() {
    return {
      files: []
    };
  },
  methods: {
    fileSelected() {
      this.files = this.$refs.fileSelector.files;
    },
    calculate() {
      var models = CalculateSD(this.files);
      console.log(models.length)
    },
    addTodo(event) {
      if (event) event.preventDefault();
      let url = "http://localhost:4000/api/add";
      let param = {
        name: this.todo,
        done: 0
      };
      axios
        .post(url, param)
        .then(response => {
          console.log(response);
          this.clearTodo();
          this.refreshTodo();
          this.typing = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearTodo() {
      this.todo = "";
    },
    refreshTodo() {
      bus.$emit("refreshTodo");
    }
  }
};
</script>
