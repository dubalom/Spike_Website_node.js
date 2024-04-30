var express = require('express')
var indexRouter = require('./routes/index.js')
const { auth } = require('express-openid-connect');
require('dotenv').config()
var path = require('path')

// auth router attaches /login, /logout, and /callback routes to the baseURL
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// Create an Express application
var app = express()
app.set('views', 'views')  // This tells Express to look for views in the views directory
app.set('view engine', 'ejs') // This tells Express to use the EJS templating engine
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'))) // This tells Express to look for static files in the public directory (like CSS files, images, etc.)
app.use('/Dummy_Database', express.static('path_to_Dummy_Database'));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use('/', indexRouter)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
