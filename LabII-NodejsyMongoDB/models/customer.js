const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customerId: Number,
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
    firstName: String,
    lastName: String,
    email: String,
    addressId: { type: Schema.Types.ObjectId, ref: 'Address' },
    active: Number,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;