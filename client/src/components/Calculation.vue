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
<script lang="ts">
import TestModel from "../models/TestModel";
import Read from "../ts/reader";
import GetStatistics from "../ts/statistics";
import StatisticsModel from "../models/StatisticsModel";
import axios from "axios";

export default {
  data() {
    return {
      filesSelectedLabel: "Choose a file…",
      files: Array<File>(),
      statisticsmodels: Array<StatisticsModel>()
    };
  },
  methods: {
    filesSelected() {
      this.files = this.$refs.fileSelector.files;
      this.filesSelectedLabel = this.files.length + " files selected";
    },
    calculate() {
      let models: TestModel[] = new Array<TestModel>();
      const ignoreList: string[] = new Array<string>();
      const files: File[] = this.files;
      for (const file of files) {
        const parsedRows: TestModel[] = Read(file);

        parsedRows.forEach(model => {
          axios({
            method: "post",
            url: "/api/models",
            data: JSON.stringify(parsedRows)
          });
        });
      }
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