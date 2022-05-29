const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    storeId: Number,
    managerStaffId: Number,
    addressId: Number,
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;