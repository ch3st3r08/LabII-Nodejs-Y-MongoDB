const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customerId: Number,
    storeId: Number,
    firstName: String,
    lastName: String,
    email: String,
    addressId: Number,
    active: Number,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;