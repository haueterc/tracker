require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')
    , bodyParser = require('body-parser');

// envoke express in app
const app = express();

// destructuring from .env file
const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING
} = process.env;

// need explanation
massive(CONNECTION_STRING).then( db => {
    app.set('db', db);
})
//-- serve up static files from npm run build
// app.use(express.static(__dirname + './../build'))

// body-parser
app.use(bodyParser.json());

// need explanation
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true 
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done) {

    //db calls here

    const db = app.get('db');
    // massive wants arguments passed in as an array
    const { id, displayName, picture } = profile;

    db.find_user([id]).then( users => {
        // make sure the array isn't empty because that throws an error
        if (users[0]) {
            // why is the first param null?
            return done(null, users[0].id)
        } else {
            db.create_user([displayName, picture, id])
            .then( createdUser => {
                return done(null, createdUser[0].id)
            })
        }
    })
}))

passport.serializeUser( (id, done) => {
    //puts info into the session store
    return done(null, id)
})

passport.deserializeUser( (id, done) => {
    // retrieves info from the session store
    // puts info on req.user
    // fires before anthing else like componentdidmount
    app.get('db').find_session_user([id]).then( user => {
        done(null, user[0]);
    })
})

app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0', {
    // change the port after npm run build to point to the backend server
    successRedirect: 'http://localhost:3005/#/private',
    failureRedirect: 'http://localhost:3005'
}))

app.get('/auth/me', function(req, res) {
    if (req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(401).send('Nice try sucka')
    }
})

app.get('/search', function(req, res) {
    app.get('db').find_handle()
})

app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('http://localhost:3005')
})

app.listen(SERVER_PORT, () => {
    console.log(`Listening on Port: ${SERVER_PORT}`)
});
