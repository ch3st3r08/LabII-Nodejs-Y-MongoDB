var express = require('express');
var router = express.Router();
const methods = require('../methods');
const { route } = require('express/lib/application');

//Exportamos fs
var fs = require('fs');
const User = require('../models/user');


//rutas
const registerRoute = '../views/pages/register';
const loginRoute = '../views/pages/login';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Login or Register' });
});
router.get('/home', function (req, res) {
  if (req.user) {
    res.render('home', { title: "Welcome", userName: req.user.fullName });
  } else {
    res.render(loginRoute, {
      message: "Login to continue",
      messageClass: "alert-danger"
    });
  }
});


router.get('/register', (req, res) => {
  res.render(registerRoute)
});

router.get('/login', (req, res) => {
  res.render(loginRoute)
});

router.post('/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    //verificar si los password coinciden
    if (password === confirmPassword) {

      //validar si el correo existe

      user = await User.findOne({ email: email })
        .then(user => {
          if (user) {
            res.render(registerRoute, {
              message: "The user is already registered",
              messageClass: "alert-danger"
            });
          } else {
            //encriptamos el password
            const hashedPassword = methods.getHashedPassword(password);
            //creamos un nuevo objeto a partir del modelo User
            const userDB = new User({ 'fullName': fullName, 'email': email, 'password': hashedPassword })
            //guardar los datos
            userDB.save()

            res.render(loginRoute, {
              message: "Full Registration. Now, you can login",
              messageClass: "alert-success"
            });
          }
        });

    } else {
      res.render(registerRoute, {
        message: "Passwords do not match",
        messageClass: "alert-danger"
      });
    }
  } catch (error) {
    console.log('error', error);
  }

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);

  user = await User.findOne({ email: email, password: hashedPassword })
    .then(user => {
      if (user) {
        const authToken = methods.generateAuthToken();
        // almacenar el token de autenticación
        methods.authTokens[authToken] = user;
        // guardar el token en una cookie
        res.cookie('AuthToken', authToken); //settings token
        res.redirect("/home"); //redirect
      } else {
        res.render(loginRoute, {
          message: "The username or password is not valid",
          messageClass: "alert-danger"
        });
      }
    })
});

//logout
router.get('/logout', (req, res) => {
  res.clearCookie('AuthToken');
  return res.redirect('/');
})

module.exports = router;