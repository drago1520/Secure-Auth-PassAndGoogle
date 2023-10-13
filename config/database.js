const mongoose = require('mongoose');
const validPassword = require('../lib/passwordUtils').validPassword;
const genPassword = require("../lib/passwordUtils").genPassword;
const findOrCreate=require('mongoose-findorcreate')
require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = process.env.DB_STRING;

const connection = mongoose.connect(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    _id: String,
    secrets: String
});
UserSchema.plugin(findOrCreate);
let modelName = mongoose.model("modelName", UserSchema);

// Expose the connection
module.exports = {
   modelName,
   connection
}
