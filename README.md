# SocketIO Practice

# how to use: npm install, npm start(make sure mongodb is running)

Google Oauth 400 redirect_uri_mismatch Error

please make sure the update the **Client ID** **Client Secret** 

and add url to 

**Authorized JavaScript origins**

**Authorized redirect URIs**

https://stackoverflow.com/questions/41448014/google-script-oauth2-error-redirect-uri-mismatch

Reference Course from https://www.udemy.com/node-with-socketio-build-a-full-web-chat-app-from-scratch/learn/v4/overview


# Document for this project

**app.js**

cors: allow cross domain access

express-validator: validator middleware, not used....
https://www.npmjs.com/package/express-validator

express-session: https://www.npmjs.com/package/express-session
(session used in login security)

connect-mongo: MongoDB session store for Connect and Express
https://www.npmjs.com/package/connect-mongo

mongoose: mongoDB orm

flash: flash data in request, not used

passport: Passport is authentication middleware for Node.js,
can use local or 3rd party authentication
http://www.passportjs.org/docs/

socketIO: enable bi-direction messages between client and server
 
# /models
mongoose schema for models, user has the method to encrypt and decrpt password

# /passport
**passport-local.js**
use the local db for authenticate

http://www.passportjs.org/docs/configure/
Strategies, and their configuration, are supplied via the use() function. For example, the following uses the LocalStrategy for username/password authentication.


serializeUser/deserializeUser 
serialize the id, and get user data based on id
if loged in the user can be access by req.user/req.logout
http://www.passportjs.org/docs/configure/

**passReqToCallback: true** otherwise not req in function(req, email, password, done)

**done()** https://stackoverflow.com/questions/32153865/what-is-done-callback-function-in-passport-strategy-configure-use-function

passport.use('local.signup'...
http://www.passportjs.org/docs/username-password/
signup: check if email is already exist, if no save new user

passport.use('local.login'...
check user email and password, then done with success/error

**passport-google.js**

http://www.passportjs.org/docs/google/
use the google oauth for authenticate

function (req, token, refreshToken, profile, done)
no err, just done with google user


# /public 
just npm run build files from SocketIOUI reactjs project


# /routes
**index.js**

`router.get(['/gate','/user/*','/room/*'])`
render view html


router.get('/currentuser')get current user from session


//https://stackoverflow.com/questions/15388206/sending-back-a-json-response-when-failing-passport-js-authentication

custome set json response when use xhr the passport authenticate

http://www.passportjs.org/docs/authenticate/

router.post('/login')

passport.authenticate('local.signup', {failWithError: true}),

router.post('/signup')

passport.authenticate('local.signup', {failWithError: true}),

**'local.login'or 'local.signup' match the name strategy in passport-local.js**

**{failWithError: true} if authenticate fail, it will go to the err callback function**



router.get('/auth/google'

router.get('/auth/google/callback'

authenticate use the google strategy



**user.js**

//get user by id

router.post('/user'

//get most recent 10 message for  a user

router.post('/message'


# /sockets
**chat.js** configure the socket for chat

let nsp = io.of('/chat');
set namespace for chat

socket.on('join'

when user join a room, sometime the client may sent join when sender is null, then redirect to /gate,
some if sender is null, then do nothing

socket.on('fetchRoomUserList'

when user join a room, need to fetch all users in this room,
then nsp.to(message.room) will update the current user list to all user

socket.on('createMessage'

when user create new message, then sent this message to all users in this room

socket.on('disconnecting'

when user disconnect, remove that user from all user list ,
the room only available in 'disconnecting', 
in 'disconnect', room can't be access, because the user already exist the room









 