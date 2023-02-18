const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const loggedIn = require("../middleware/loggedIn");
const loggedOut = require("../middleware/loggedOut");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', (req, res, next) => {

  let { username, password, repeatPassword } = req.body

  User.find({ username })
    .then(result => {
      if (result.length != 0) {
        res.render('login', { mensajeError: "Usuario ya resgistrado" })
        return
      }
    })
    .catch(err => next(err))

  if (username == "" || password == "" || repeatPassword == "") {
    res.render("signup", { mensajeError: "Campos Incompletos" })
    return
  }
  else if (password != repeatPassword) {
    res.render('signup', { mensajeError: "Password no coincide" })
    return
  }

  let salt = bcrypt.genSaltSync(saltRounds);
  let passwordEncriptado = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: passwordEncriptado
  })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => next(err))
})




router.get("/login", (req, res, next) => {
  res.render("login")
})

router.post('/login',/*  loggedOut,  */(req, res, next) => {
  /* console.log('estamos en el POST') */

  let {username, password} = req.body

  if( username == ""|| password == "" ){
    res.render('login', {mensajeError: "Campos incompletos"})
    return
  }

  User.find({username})
  .then(result =>{
    console.log('result',result)
    if(result.length == 0){
      res.render('login', {mensajeError: "Usuario no existe"})
      return
    }

    if(bcrypt.compareSync(password, result[0].password)) {
      req.session.currentUser = username; 
      res.redirect("/private");
    } else {
      res.render("login", { mensajeError: "Credenciales incorrectas" });
    }
  })
  .catch(err => next(err))
})

router.get('/main', (req,res,next)=>{
res.render('main',)
})

router.get('/private', loggedIn ,(req,res,next)=>{
  res.render('private')
})

router.get("/logout", loggedIn, (req, res, next)=>{
  req.session.destroy(err => {
    if(err) next(err);
    else res.redirect("/login");
  });
});
module.exports = router;
