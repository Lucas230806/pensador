const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const Filestore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

//models
const User = require('./models/User')
const Tought = require('./models/Tought')

//import engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'Handlebars')

//import json
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//import middleware para conrole de sessoes
app.use(session({
  name:"session",
  secret:"nosso_segredo",
  resave: false,
  saveUninitialized: false,
store: new Filestore({
  logFn:function() {},
  path: require('path').join(require('os').tmpdir(),'sessions')
}),
cookie:{
  secure:false,
  maxAge: 360000,
  expires: new Date(Date.now() + 360000),
  httpOnly: true
}
}))

// import as flash messages
app.use(flash())

//import static files
app.use(express.static('public'))

//middleware para armazenar sessoes para resposta
app.use((request, response, next)=>{
  if(request.session.userId){
    response.locals.session = request.session
  }
  next()
})

conn
.sync()
.then(()=>{
  app.listen(3333)
})
.catch((err)=>console.log(err))


