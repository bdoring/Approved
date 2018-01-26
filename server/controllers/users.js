const knex = require("../db/knex.js");
const jwt = require('jsonwebtoken');
const passwordEncryption = require('../config/encryption.js');

function getUserFromRequest(request) {
  return {
    first_name: request.first_name.toUpperCase(),
    last_name: request.last_name.toUpperCase(),
    email: request.email.toUpperCase(),
    password: request.password.toUpperCase(),
    role: request.role.toUpperCase()
  }
}

module.exports = {

  redirect: function(req, res) {
    res.redirect('/users');
  },

  //VueAuth
  login: function(req, res) {
    let loginUser = {
      email: req.body.email.toUpperCase(),
      password: req.body.password.toUpperCase()
    }
    knex('users')
      .where('email', loginUser.email)
      .then(user => {
        if (user[0]) {
          passwordEncryption.check(user[0], loginUser)
            .then(isMatch => {
              if (isMatch) {
                let token = jwt.sign({ user }, 'secret-string');
                res.send({ user, token});
              } else {
                res.status(401).send({error: 'Invalid Login'})
              }
          })
          .catch(err => {
            res.status(500).send({error: 'Internal Server Error'})
          })
        } else {
          res.status(401).send({error: 'Invalid Login'})
        }
      })
      .catch(err => {
        console.log("error:", err);
        res.status(500).send({error: 'Internal Server Error'})
      })
  },

  getAll: function(req, res) {
    knex('users')
      .then((users) => {
        res.send(users);
      })
  },

  getOne: function(req, res) {
    knex('users')
      .where('id', req.params.id)
      .then((user) => {
        user[0] ? res.send(user) : res.send({error: "User Not Found."});
      })
  },

  createOne: function(req, res) {
    let newUser = getUserFromRequest(req.body);
    console.log("newUser:", newUser);
    passwordEncryption.hash(newUser).then((encryptedUser) => {
      knex('users')
        .insert(encryptedUser, '*')
        .then((user) => {
          res.status(200).send(user);
        })
    })
  },

  updateOne: function(req, res) {
    let updatedUser = getUserFromRequest(req.body);
    knex('users')
      .update(updatedUser, '*')
      .where('id', req.params.id)
      .then((user) => {
        user[0] ? res.send(user) : res.send({error: "User Not Found."});
      })
  }
}
