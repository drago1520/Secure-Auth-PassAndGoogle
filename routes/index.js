const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const connection = require('../config/database');
const modelName = require('../config/database').modelName;
function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    } 
    next();
  }
  function escapeHtml(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  return input.replace(/[<>'"&]/g, function (match) {
    switch (match) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case "'":
        return '&#39;';
      case '"':
        return '&quot;';
      case '&':
        return '&amp;';
      default:
        return match;
    }
  });
}
/**
 * -------------- POST ROUTES ----------------
 */

 // (+) passport.authenticate; ('<strategy>')
 //Passport intercepts (req, res, next)
 
 //!!! if (user) --> ще изпълни (req, res, next)
 //TEST --> removed passport.authenticate('local', { failureRedirect: '/login-failure'}),
 router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure'}), (req, res, next) => {
    res.redirect('/protected-route');
    
    // 
    
    //code if authenticated SUCCESSFULLY
 })

 // Added custom _id
 router.post('/register', async(req, res, next) => {
    const hash = await passwordUtils.genPassword(req.body.hash);
    const newUser = new modelName({
        username: req.body.username,
        hash: hash,
        _id: req.body.username
    })
    try {
        const save_response = await newUser.save();
    } catch (error) {
        console.error('Error saving user:', error);
    }
    res.redirect('/login');
 });
    

 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    const form = `<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>
    Auth with Google: <form action="/auth/google1" method="POST">
                    <button type="submit">Google</button></form>`;

    res.send(form);

});


// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = `<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="hash">\
                    <br><br><input type="submit" value="Submit">\
                    </form>
                    Auth with Google: <form action="/auth/google1" method="POST">
                    <button type="submit">Google</button></form>`;

    res.send(form);
    
});
//Select account menu in Google
router.post('/auth/google1', 
  passport.authenticate('google', { failureRedirect: '/login', scope: ['profile'] }));

router.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    
    // Successful authentication, redirect home.
    res.redirect('/protected-route');
  });

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */

                    //Adding individual data to DB
router.get('/protected-route', ensureAuthenticated, (req, res, next) => {
    //console.log("gayy");
    res.send(`<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>
    <form action="/protected-route" method="POST"><input type="text" name="secret_key"><input type="submit" value="POST"></form>`);
});
router.post('/protected-route', ensureAuthenticated, (req,res,next)=>{
    console.log(req.user.id);
    const user_input = escapeHtml(req.body.secret_key);
    console.log(user_input);
    modelName.updateOne({_id: req.user.id}, {secrets: user_input})
    .then((result) => {
        console.log(result);
    })

  .catch((error) => {
    console.error("Error:", error);
  })
})
router.get('/logout', (req,res,next)=>{
    res.send(`<form id="postForm" action="/logout" method="POST">
    <button type="submit">Submit</button>`);
})
// Visiting this route logs the user out
router.post('/logout', (req, res, next) => {
    req.logout((err)=>{
        if (err){return next(err);}
    });
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    if (!req.isAuthenticated()){
        res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
    }else{
        res.send("<h2>Wut you doin here?</h2>");
    }
  
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;


//TEST f():
//(async function verifyCallback(username, password){
    //     modelName.find({username: username}).exec()
    //     .then((user)=>{
    //         if (!user[0]){console.log("no such user!");} //няма err + няма user.
    
            
    //         const isValid = validPassword(password, user[0].hash);
    
    //         if(isValid){
    //             console.log("success, BUT I was sending back user[0]"); 
    //         }else{
    //             console.log("no such user!"); 
    //         }
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // })(req.body.username, req.body.password)