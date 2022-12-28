const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('ToDoModel',todoSchema);