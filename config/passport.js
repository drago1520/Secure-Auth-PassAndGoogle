const passport = require('passport');
const LocalStrategy = require('passport-local');
const connection = require('./database').connection;
require('dotenv').config()
const modelName = require('../config/database').modelName;
const validPassword = require('../lib/passwordUtils').validPassword;
//Form field
const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};
//Test
const findOrCreate = require('mongoose-findorcreate');
const { modelNames } = require('mongoose');


/*done - f(), която ще има резултати от Auth.

//Verify f() - няма значение каква е стига да връща 
    return done(null, user) ||
    cb(null, false) ||
    cb(err); */
//POTENTIAL FIX - user --> user[0] in return()
const verifyCallback = (username, password, done) =>{
    modelName.find({username: username}).exec()
    .then((user)=>{
        //Трябва да е {key: value}
        if (!user[0]){return done(null, false)} //няма err + няма user.

        
        validPassword(password, user[0].hash)
        .then((isValid)=>{
            if(isValid){
                return done(null, user[0]); //както е в doc
            }else{
                return done(null, false) //както е в doc
            }
        }).catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err)=>{
        done(err);
    })
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);


//в docs:
//Мога да сложа САМО userID, username и снимка.
//При verified successfully --> call serialize user f()
passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, {id: user.id}); 
    });
  });

  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });


  const GoogleStrategy = require('passport-google-oauth20').Strategy;

  passport.use(new GoogleStrategy({

    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.GCALLBACK //http://localhost:3000/auth/google/secrets

  }, function(accessToken, refreshToken, profile, done) {
    
    //console.log(profile);
    // Find a user by their _id
    let error = null;
    let new_User = null;
    let _id = profile.id;
    modelName.findOne({ _id: _id }).exec()
      .then((user) => {
        
        if (user) {
          // If a user with this _id exists, return the user
          new_User = user;
          return done(error, new_User);
        } else {
          // If no user is found, create a new user with the _id
          //Anything other to save too
          const newUser = new modelName({ _id: _id });
          newUser.save()
          .then(newUser => {
            new_User = newUser;
            return done(error, new_User);
            
            // Return the newly created user or the found user
          })
          .catch(err => {
            error = err;
            return done(error, new_User);
          });
        }
      })
      .catch(err => {
        error = err;
        return done(error, new_User);
      })
  }));
  
  
  
  
  
  
  