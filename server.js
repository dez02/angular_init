const express = require('express');
const app = express();

const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
});

app.use(morgan('dev'));
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true });

// admonRouter
adminRouter.use(function(req, res, next) {
  // log each request to the console
  console.log(req.method, req.url);
  // continue doing what we were doing and go to the route
  next();
  });

adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard!');
  });

  // users page (http://localhost:1337/admin/users)
  adminRouter.get('/users', function(req, res) {
  res.send('I show all the users!');
  });
  // posts page (http://localhost:1337/admin/posts)
  adminRouter.get('/posts', function(req, res) {
  res.send('I show all the posts!');
  });


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name,
    username: req.body.username
  }).select('name username password').exec(function(err, user) {
    if (err) throw err;
  // no user with that username was found
    if (!user) {
     res.json({
      success: false,
      message: 'Authentication failed. User not found.'
    });
  } else if (user) {
// check if password matches
    const validPassword = user.comparePassword(req.body.password);
    if (!validPassword) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.'
     });
    } else {
// if user is found and password is right
// create a token
      const token = jwt.sign({
       name: user.name,
       username: user.username
      }, superSecret);
      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
  }
});
});

// route middleware to verify a token
apiRouter.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
const token = req.body.token || req.param('token') || req.headers['x-access-token'];
// decode token
if (token) {
// verifies secret and checks exp
  jwt.verify(token, superSecret, function(err, decoded) {
    if (err) {
      return res.status(403).send({
        success: false,
        message: 'Failed to authenticate token.'
      });
  } else {
// if everything is good, save to request for use in other routes
    req.decoded = decoded;
    next();
  }
});
} else {
// if there is no token
// return an HTTP response of 403 (access forbidden) and an error message
  return res.status(403).send({
    success: false,
    message: 'No token provided.'
  });
}
});

apiRouter.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
  });

  apiRouter.route('/users')
  // create a user (accessed at POST http://localhost:1337/api/users)
    .post(function(req, res) {
    // create a new instance of the User model
      const user = new User();
      // set the users information (comes from the request)
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;
      // save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ success: false, message: 'A user with that\
          username already exists. '});
          else
            return res.send(err);
          }
            res.json({ message: 'User created!' });
        });
    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) res.send(err);
  // return the users
        res.json(users);
    });
  });

apiRouter.get('/me', function(req, res) {
  res.send(req.decoded);
  });

apiRouter.route('/users/:user_id')
  // get the user with that id
  // (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
  // return that user
     res.json(user);
  });
})
  .put(function(req, res) {
    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

    // update the users info only if its new
      if(req.body.name) user.name = req.body.name;
      if(req.body.username) user.username = req.body.username;
      if(req.body.password) user.password = req.body.password;
    // save the user
      user.save(function(err) {
        if (err) res.send(err);
    // return a message
      res.json({ message: 'User updated!' });
      });
    });
  })
  .delete(function(req, res) {
    User.remove({_id: req.params.user_id}, function(err, user) {
      if (err) return res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });

  // apiRouter
apiRouter.route('/users/:user_id')
  // get the user with that id
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
    if (err) res.send(err);
    // return that user
    res.json(user);
    });
  })

  .put(function(req, res) {
    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
    
      if(req.body.name) user.name = req.body.name;
      if(req.body.username) user.username = req.body.username;
      if(req.body.password) user.password = req.body.password;
    // save the user
      user.save(function(err) {
        if (err) res.send(err);
    // return a message
        res.json({ message: 'User updated!' });
      });
    });
  })



app.use('/admin', adminRouter);
app.use('/api', apiRouter);



app.listen(config.port);
console.log(`Magic happens on port ${config.port}`);
