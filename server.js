import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./model.js";
import IpLogger from "./middleWares/Iplogger.js";
import requireLogin from "./middleWares/requireLogin.js";
const saltRound=10;
const url = 'mongodb://127.0.0.1:27017/logger';
const app = express();



app.set('view engine', 'ejs');

app.use(session({
    secret: 'hello there',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //the user was login in for 7 days
        maxAge: 60 * 60 * 24 * 7 * 1000,
    },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected!'))
    .catch((error)=>{console.log("there  was error in connecting the mongodb: "+error)});






app.get('/', IpLogger, (req, res) => {
    if (!req.session.userId){
        return res.render('main',{show:false,newShow:true,message:false});
    }
    if (req.query.message==='main'){
        return res.render('main',{show:false,newShow:true,message:true});
    }
    res.render('main',{show:true,newShow:false,message:false});
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
    res.render('dashboard',{name:flame.name});
});

app.get('/logout', async (req, res) => {
    if (req.session.userId) {
        const flame = await User.findById(req.session.userId);
        if (flame) {
            console.log(flame.name + " was logged out");
            req.session.destroy();

           return  res.redirect('/login?message=you+have+successfully+logged+out');
        }
    }
    else {
        return  res.redirect('/');
    }

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
                console.log(user.name+" was log in");
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
