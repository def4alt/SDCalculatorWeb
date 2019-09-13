var mongoose = require('mongoose')

// Define collection and schema for todo Item
var todo = new mongoose.Schema({
        name: {
            type: String
        },
        chartModels: {
            type: Array
        },
        lot: {
            type: Number
        },
        ignoreList: {
            type: Array
        },
        parsedRows: {
            type: Array
        }



    },
    {
        collection: 'todos'
    })

module.exports = mongoose.model('Todo', todo);
