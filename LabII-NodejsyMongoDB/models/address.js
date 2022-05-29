const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    addressId: Number,
    address: String,
    addressTwo: String,
    district: String,
    cityId: Number,
    postalCode: String,
    phone: Number
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;