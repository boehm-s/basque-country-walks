const path         = require('path');
const http         = require('http');
const rp           = require('request-promise');
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const passport     = require('passport');
const passportFB   = require('passport-facebook');
const fbConfig     = require('./fb');

const FacebookStrategy = passportFB.Strategy;
const app              = express();
const server           = http.createServer(app);
const API_URL          = process.env.API_URL || 'http://localhost:3000';
const port             = process.env.PORT || process.env.port || 3000;

const AUTHORIZED_PEOPLE = ['Steven Boehm', 'Philip Cooper'];

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: fbConfig.facebook_api_key,
    clientSecret: fbConfig.facebook_api_secret ,
    callbackURL: fbConfig.callback_url
}, function(accessToken, refreshToken, profile, done) {
    //Check whether the User exists or not using profile.id
    //Further DB code.
    return done(null, profile);
}));

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



app.get('/',        (req, res) => {
    res.render('index', {});
});

app.get('/walks/:id',        (req, res) => {
    rp(`${API_URL}/walks/${req.params.id}`)
	.then(_walk => {
	    const walk = JSON.parse(_walk);
	    console.log(walk);
	    res.render('walk-view', walk);
	});
});


app.get('/login', (req, res) => res.redirect('/auth/facebook'));

const requireAUTH = [
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res, next) => AUTHORIZED_PEOPLE.includes(req.user.displayName)
	? next()
	: res.redirect('/')
];

app.use('/admin', ...requireAUTH);

app.get('/admin',
	(req, res) => {
	    console.log(req.user);
	    res.render('admin', {});
	});

app.get('/admin/list-walks', (req, res) => {
    res.render('admin', {});
});

app.get('/admin/add-walk', (req, res) => {
    res.render('admin-add-walk', {});
});

app.get('/admin/edit-walk/:id', (req, res) => {
    res.render('admin-edit-walk', {id: req.params.id});
});




//Passport Router for FB AUTH

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
	    failureRedirect: '/fail'
	}),
	function(req, res) {
	    console.log(req.body);
	    res.redirect('/admin');
	});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


server.listen(port, () => {
    console.log(`started on port ${port}`);
});
