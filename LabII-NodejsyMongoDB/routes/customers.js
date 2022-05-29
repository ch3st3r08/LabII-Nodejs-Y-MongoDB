const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//Llamado al modelo
const Customer = require('../models/customer');
const Address = require('../models/address');
const Store = require('../models/store');

//Ruta de login que validara que haya iniciado sesión para entrar a las rutas
const loginRouter = '../views/pages/login';

router.get('/', (req, res) => {
    if (req.user) {
        res.render('pages/customer/addEdit', {
            viewTitle: 'New Customer'
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }
});

router.post("/", (req, res) => {
    //Crear variables para almacenar los id de Address y Store
    var addressRecord = new Object();
    var storeRecord = new Object();

    Address.find((err, doc) => {
        if (!err) {
            for (i = 0; i < doc.length; i++) {
                addressRecord[i] = doc[i].addressId;
            }
            Store.find((err, doc) => {
                if (!err) {
                    for (i = 0; i < doc.length; i++) {
                        storeRecord[i] = doc[i].storeId;
                    }
                    if (req.user) {
                        var Address = false;
                        var Store = false;

                        //Verifica que el id de Store exista
                        for (i = 0; i < Object.values(storeRecord).length; i++) {
                            if (storeRecord[i] == req.body.storeId) {
                                Store = true;
                            }
                        }

                        if (Store) {
                            //Verificamos que el id de Address exista si el id de Store existe
                            for (i = 0; i < Object.values(addressRecord).length; i++) {
                                if (addressRecord[i] == req.body.addressId) {
                                    Address = true;
                                }
                            }

                            if (Address) {
                                //Se añade o actualiza el registro
                                if (req.body._id == "")
                                    newCustomer(req, res);
                                else
                                    updateCustomer(req, res);
                            } else {
                                res.render("pages/customer/addEdit", {
                                    message: "The Address doesn't exist",
                                    messageClass: "alert-danger",
                                });
                            }
                        } else {
                            res.render("pages/customer/addEdit", {
                                message: "The Store doesn't exist",
                                messageClass: "alert-danger",
                            });
                        }
                    } else {
                        res.render(loginRouter, {
                            message: "You must be logged in to view this page",
                            messageClass: "alert-danger",
                        });
                    }

                } else {
                    console.log('Error: ' + err);
                }
            });
        } else {
            console.log('Error: ' + err);
        }
    });
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

router.get('/list', (req, res) => {
    if (req.user) {
        Customer.find((err, doc) => {
            if (!err) {
                res.render('pages/customer/list', {
                    list: doc,
                    viewTitle: "Customer"
                })
            } else {
                console.log("Error", + err)
            }
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }

})

router.get('/:id', (req, res) => {
    if (req.user) {
        Customer.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render('pages/customer/addEdit', {
                    viewTitle: "Update Customer",
                    store: doc
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