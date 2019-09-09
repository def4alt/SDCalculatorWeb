Vue.component('input-textbox',
{
  props: [],
  template: '<div id="app">'+
              '<p>{{ message }}</p>'+
              '<input v-model="message"/>'+
            '</div>'
})
  