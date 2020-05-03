const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type:  Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String
    },
    discount: {
        type: Boolean
    },
    creator: {
        type: Schema.Types.ObjectID,
        ref: 'UserMGS'
    }
});

module.exports = mongoose.model('EventMGS', eventSchema);