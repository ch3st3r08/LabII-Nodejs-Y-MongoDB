const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//Llamado al modelo
const Address = require('../models/address');

//Ruta de login que validara que haya iniciado sesión para entrar a las rutas
const loginRouter = '../views/pages/login';

router.get('/', (req, res) => {
    if (req.user) {
        res.render('pages/address/addEdit', {
            viewTitle: 'New Address'
        });
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }
});

router.post('/', (req, res) => {
    if (req.user) {
        if (req.body._id == '')
            newAddress(req, res)
        else
            updateAddress(req, res)
    } else {
        res.render(loginRouter, {
            message: "You must be logged in to view this page",
            messageClass: "alert-danger"
        });
    }

});

//metodo para insertar nuevo registro
function newAddress(req, res) {
    var address = new Address();
    address.addressId = req.body.addressId;
    address.address = req.body.address;
    address.addressTwo = req.body.addressTwo;
    address.district = req.body.district;
    address.cityId = req.body.cityId;
    address.postalCode = req.body.postalCode;
    address.phone = req.body.phone;

    address.save((error) => {
        if (error)
            console.log("Error" + error)
        else
            res.redirect('address/list')
    });
}

//metodo para actualizar un registro
function updateAddress(req, res) {
    Address.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('address/list');
        } else {
            res.render('address/addEdit', {
                viewTitle: "Update Address",
                address: req.body
            })
        }
    });
}

router.get('/list', (req, res) => {
    if (req.user) {
        Address.find((err, doc) => {
            if (!err) {
                res.render('pages/address/list', {
                    list: doc,
                    viewTitle: "Address"
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
    if(req.user) {
        Address.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render('pages/address/addEdit', {
                    viewTitle: "Update Address",
                    address: doc
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
    Address.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/address/list');
        } else {
            console.log("Error" + err);
        }
    })
})

module.exports = router;