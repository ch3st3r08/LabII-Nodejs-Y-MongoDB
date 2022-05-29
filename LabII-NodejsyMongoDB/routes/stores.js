const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//Llamado al modelo
const Store = require('../models/store');
const Address = require('../models/address');

//Ruta de login que validara que haya iniciado sesión para entrar a las rutas
const loginRouter = '../views/pages/login';

router.get('/', (req, res) => {
    if (req.user) {
        res.render('pages/store/addEdit', {
            viewTitle: 'New Store'
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }
});

router.post("/", (req, res) => {
    //Crear variable para almacenar los id de Address
    var addressRecord = new Object();

    Address.find((err, doc) => {
        if (!err) {
            for (i = 0; i < doc.length; i++) {
                addressRecord[i] = doc[i].addressId;
            }
            if (req.user) {
                var Address = false;

                for (i = 0; i < Object.values(addressRecord).length; i++) {
                    if (addressRecord[i] == req.body.addressId) {
                        Address = true;
                    }
                }

                if (Address) {
                    //Se añade o actualiza el registro
                    if (req.body._id == "")
                        newStore(req, res);
                    else
                        updateStore(req, res);
                } else {
                    res.render("pages/store/addEdit", {
                        message: "The Address doesn't exist",
                        messageClass: "alert-danger",
                    });
                }
            } else {
                res.render(loginRouter, {
                    message: "Please log in to continue",
                    messageClass: "alert-danger",
                });
            }
        }
    });

});

//metodo para insertar nuevo registro
function newStore(req, res) {
    var store = new Store();
    store.storeId = req.body.storeId;
    store.managerStaffId = req.body.managerStaffId;
    store.addressId = req.body.addressId;

    store.save((error) => {
        if (error)
            console.log("Error" + error)
        else
            res.redirect('store/list')
    });
}

//metodo para actualizar un registro
function updateStore(req, res) {
    Store.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('store/list');
        } else {
            res.render('store/addEdit', {
                viewTitle: "Update Store",
                store: req.body
            })
        }
    });
}

router.get('/list', (req, res) => {
    if (req.user) {
        Store.find((err, doc) => {
            if (!err) {
                res.render('pages/store/list', {
                    list: doc,
                    viewTitle: "Store"
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
        Store.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render('pages/store/addEdit', {
                    viewTitle: "Update Store",
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
        Store.findByIdAndDelete(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/store/list');
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