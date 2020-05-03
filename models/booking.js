const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'EventMGS'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserMGS'
    }
}, { timestamps: true }); // 2nd arg in constructor to setup options for schema
// autoadd createdAt, updatedAt as db fields

module.exports = mongoose.model('BookingMGS', bookingSchema);