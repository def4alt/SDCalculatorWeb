<template>
  <div>
    <div id="calculation">
      <label for="fileSelector">
        <span>{{filesSelectedLabel}}</span>
      </label>
      <input
        type="file"
        id="fileSelector"
        ref="fileSelector"
        class="inputfile inputfile-3"
        multiple
        v-on:change="filesSelected"
      />
      <button type="button" class="btn btn-primary" v-on:click="calculate">Calculate</button>
    </div>
    <div id="cards"></div>
  </div>
</template>
<script>
import Read from "../js/reader";
import GetStatistics from "../js/statistics";
export default {
  data() {
    return {
      filesSelectedLabel: "Choose a file…",
      files: []
    };
  },
  methods: {
    filesSelected() {
      this.files = this.$refs.fileSelector.files;
      this.filesSelectedLabel = this.files.length + " files selected";
    },
    calculate() {
      const ignoreList = new Array();
      const files = this.files;
      let models = Array.from(files).map(file => {
        const parsedRows = Read(file);
		return parsedRows;
	  });

	  models = [...models[0], ...models[1]];

	  console.log(hello);

      GetStatistics(models, ignoreList);
    }
  }
};
</script>
<style>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}
.inputfile:focus + label,
.inputfile + label:hover {
  background-color: red;
}
</style>