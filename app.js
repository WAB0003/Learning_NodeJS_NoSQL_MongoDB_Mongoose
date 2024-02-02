const path = require('path');                                 // Core Module


const express = require('express');                           // Bring in Express for handling router Object              
const bodyParser = require('body-parser');                    // Express tool to process data sent in HTTP requests
// IMPORT MONGOOSE
const mongoose = require('mongoose');                         //  import mongoose to set up connection

const errorController = require('./controllers/error');       // CONTROLLER used for Catching any requests not defined in routes folder


const User = require('./models/user');                        // Bring in User Model

const app = express();                                        // CREATE AN EXPRESS APP

// CONGIGURE EXPRESS APPLICATION SETTINGS (https://expressjs.com/en/api.html) 
app.set('view engine', 'ejs');                                // Set the view engine setting to read ejs files
app.set('views', 'views');                                    // Set the view setting to read from the 'views' directory

// BRING IN ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));          // MIDDLEWARE parses http request data and creates a 'Body' object
app.use(express.static(path.join(__dirname, 'public')));      // MIDDLEWARE for using static files in the 'public' directory such as CSS files


// MIDDLEWARE for obtaining the user so that all information done within app is associated with a USER
app.use((req, res, next) => {
  User
    .findById('65bc0e1137263d07aa38f3f3')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


// MIDDLEWARE for USING ROUTE FILES
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// MIDDLEWARE FOR CATCHING ALL HTTP REQUEST NOT ASSIGNED IN ROUTES MENTIONED ABOVE
app.use(errorController.get404);


// Mongo Stuff:
// https://cloud.mongodb.com/v2/65b7e2a87ff97a39892e219d#/overview
// username: billabrown90
// password: An2yZqRdZsubpv19


// CONNECT TO DATABASE AND TELL DB TO LISTEN TO LOCALHOST: 3000
//.connect() is a mongoose method that automatically connects to mongoDb given the Connection String:
mongoose
.connect('mongodb+srv://billabrown90:An2yZqRdZsubpv19@cluster0.qbvkp7g.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
  User.findOne().then(user => {
    if (!user){
      const user = new User({
        name: 'Bill',
        email: 'willbilly@bill.com',
        cart: {
          items: []
        }
      })
      user.save()
    };
  });
  app.listen(3000);
})
.catch(err=> console.log(err))


// Notes and Stuff:
//Shantaram imageURL: https://m.media-amazon.com/images/W/MEDIAX_849526-T2/images/I/51xqLPCQMtL._SY445_SX342_.jpg
//BSS imageURL: https://m.media-amazon.com/images/W/MEDIAX_849526-T2/images/I/41qX7aWtRfL._SY445_SX342_.jpg

