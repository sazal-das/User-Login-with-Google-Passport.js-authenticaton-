const express = require('express');
const ejs = require('ejs');
const authRouter = require('./routers/auth-routes');
const profileRouter = require('./routers/profile-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const MongoClient = require('mongodb').MongoClient;
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

//set view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect database
mongoose.connect(keys.mongodb.dbURI, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('Connected to the database');

});

//set up router
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

//create home route
app.get('/', (req, res) => {
    res.render('home',{user:req.user});
}); 



app.listen(3000, () => {
    console.log('Server is running on port 3000');

})