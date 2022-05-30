const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//Llamado al modelo
const Customer = require('../models/customer');
const Address = require('../models/address');
const Store = require('../models/store');

//Ruta de login que validara que haya iniciado sesión para entrar a las rutas
const loginRouter = '../views/pages/login';

router.get('/', async (req, res) => {
    if (req.user) {
        const addressDoc = await Address.find({},'address')
        const storeDoc =  await Store.find({}, 'storeId')
        res.render('pages/customer/addEdit', {
            viewTitle: 'New Customer',
            addressDoc: addressDoc,
            storeDoc: storeDoc
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }
});

router.post("/", async (req, res) => {
    if(req.user){
        if(!req.body.addressId || !req.body.storeId){
            const addressDoc = await Address.find({},'address')
            const storeDoc =  await Store.find({}, 'storeId')
            res.render("pages/customer/addEdit", {
                message: "The Address or the Store don't exist",
                messageClass: "alert-danger",
                addressDoc: addressDoc,
                storeDoc: storeDoc
            })
        }
        if (req.body._id == "")
            newCustomer(req, res);
        else
            updateCustomer(req, res);
    }else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger",
        });
    }
});

//metodo para insertar nuevo registro
function newCustomer(req, res) {
    var customer = new Customer();
    customer.customerId = req.body.customerId;
    customer.storeId = req.body.storeId;
    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.email = req.body.email;
    customer.addressId = req.body.addressId;
    customer.active = req.body.active;

    customer.save((error) => {
        if (error)
            console.log("Error" + error)
        else
            res.redirect('customer/list')
    });
}

//metodo para actualizar un registro
function updateCustomer(req, res) {
    Customer.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('customer/list');
        } else {
            res.render('customer/addEdit', {
                viewTitle: "Update Customer",
                store: req.body
            })
        }
    });
}

router.get('/list', async (req, res) => {
    if (req.user) {
        const doc = await Customer.find({}).populate('addressId').populate('storeId');
        res.render('pages/customer/list', {
            list: doc,
            viewTitle: "Customer"
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }

})

router.get('/:id', async (req, res) => {
    if (req.user) {
        const addressDoc = await Address.find({},'address')
        const storeDoc =  await Store.find({}, 'storeId')
        Customer.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render('pages/customer/addEdit', {
                    viewTitle: "Update Customer",
                    customer: doc,
                    addressDoc: addressDoc,
                    storeDoc: storeDoc
                });
            }
        })
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }

})

router.get('/delete/:id', (req, res) => {
    if (req.user) {
        Customer.findByIdAndDelete(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/customer/list');
            } else {
                console.log("Error" + err);
            }
        })
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        })
    }

})

module.exports = router;