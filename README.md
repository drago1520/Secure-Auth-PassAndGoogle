# Secure-Auth-PassAndOAuth2.0-Cookies-Sessions
I have implemented a secure log-in, sessiona management and logout with password and Google OAuth 2.0 using passport.js, express-session and MongoDB. It uses hashes (bcrypt + salting) + cookies + defence against SQL and other types of injections by escaping characters.

How to run:
1. npm i
2. Install MongoDB
3. mongod (to run mongoDB server locally)
4. in another terminal - nodemon app.js
5. localhost:3000 in browser.
6. You can now log-in and logout securely.
*I have intentionally left the .env keys and secrets for a easier use for demonstrations.
