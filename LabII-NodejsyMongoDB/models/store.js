const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    storeId: Number,
    managerStaffId: Number,
    addressId: { type: Schema.Types.ObjectId, ref: 'Address' },
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;