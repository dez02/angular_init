const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const superSecret = config.secret;


module.exports = function(app, express){
  const apiRouter = express.Router();

apiRouter.post('/authenticate', (req, res ) => {
  User.findOne({
    username: req.body.username
  }).select('name username password').exec((err, user) => {
    if (err) throw err;
    if(!user) {
      res.json({ success: false, message: 'Auth failed. No user found'});
    } else if (user) {
      console.log(user)
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) throw err;
        if (!isMatch) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else{
          const token = jwt.sign({
            name: user.name,
            username: user.username
          }, superSecret);
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      });

    }
  });
});

// MIDDLEWARE FOR VERIFY TOKEN
apiRouter.use((req, res, next) => {
  const token = req.body.token || req.query || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) { if (err) {
      return res.status(403).send({ success: false,
        message: 'Failed to authenticate token.'
      });
    } else {
      next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// apiRouter
apiRouter.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!'})
});

// apiRouter.route()
apiRouter.route('/users')
  .post((req, res) => {
    const { name, username, password } = req.body;
    const user = new User({name, username, password});
    user.save(err => {
      if (err) {
        if (err.code === 11000) {
          return res.json({ success: false, message: 'A user with that username already exists.'});
        } else{
          return res.send(err);
        }
      }   res.json({ message: 'User created!'});
    });
  })

  .get((req, res) => {
    User.find((err, users) => {
      if (err) {
        res.send(err);
      } res.json(users);
    });
  });

apiRouter.route('/users/:user_id')
  .get((req, res)=> {
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.send(err);
      res.json(user);
    });
  })

  .put((req, res) => {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      // update the users info only if its new
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;
      // save the user
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'User updated!' });
      });
    });
  })

  .delete(function(req, res) {
    User.remove({
    _id: req.params.user_id }, function(err, user) {
     if (err) res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });
  return apiRouter; };


// // GET USER INFORMATION
// apiRouter.get('/me', (req, res) => {
//   res.send(req.decoded);
// });



// app.use('/api', apiRouter);



