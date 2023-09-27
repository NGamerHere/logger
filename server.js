
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt=require('bcrypt');
const saltRound=10;
const url = 'mongodb+srv://<n11>@loginuserdata.9ldipu1.mongodb.net/?retryWrites=true&w=majority';
const app = express();
const User=require('./Models');

app.set('view engine', 'ejs');

app.use(session({
    secret: 'hello there', // Replace with your session secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 24 * 7 * 1000,
    },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected!'));



// Middleware to check for a valid session
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    if (!req.session.userId){
        return res.render('main',{show:false});
    }
    res.render('main',{show:true});
});

app.get('/login', (req, res) => {
    const message = req.query.message;
    if (req.session.userId){
        return res.redirect('/dashboard');
    }
    if (message === undefined) {
        res.render('login', { message: ' ' ,messAlert:''});
    } else {
        res.render('login', { message: message,messAlert:'normal'});
    }
});

app.get('/registration', (req, res) => {
    res.render('registration',{message:' ',messAlert:false});
});

app.get('/dashboard', requireLogin, async (req, res) => {
    const userId = req.session.userId;

    // Fetch user data based on userId and render the dashboard
    const flame=await User.findById(userId);
    console.log(flame)
    res.render('dashboard',{name:flame.name});
});

app.get('/logout', (req, res) => {

    req.session.destroy();
    // Redirect to the login page
    res.redirect('/login?message=you+have+successfully+logged+out');
});

app.post('/registration', async (req, res) => {
    const { name, email, password,repassword } = req.body;

    req.session.destroy();
    if (password !== repassword ){
        return res.render('registration',{message:'password didnt matched',messAlert:true})
    }
    const flame = await User.findOne({ email: email });
    if (flame) {
        res.redirect('/login?message=Email+already+exists');
    } else {
        const passHash=await bcrypt.hash(password,saltRound);
        const user = new User({
            name,
            email,
            password:passHash
        });

        user.save().then(() => {
            console.log('User created!');
        }).catch((error) => {
            console.error('Error creating user:', error);
        });


        res.redirect('/login?message=login+here');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    const user = await User.findOne({ email: email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            // Log the user in by creating a session
            req.session.userId = user._id;
            // Check if the response has already been sent
            if (!res.headersSent) {
                res.redirect('/dashboard');
            }
        } else {
            res.render('login', { message: 'Wrong password', messAlert:'error'});
        }
    } else {
        res.render('login', { message: 'User not found',messAlert:'error' });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
