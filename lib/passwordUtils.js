const bcrypt = require('bcrypt');
const passport = require('passport');

// TODO
async function validPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    console.log(match);
    return match;
}
async function genPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;