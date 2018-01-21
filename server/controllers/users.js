const knex = require("../db/knex.js");

function getUserFromRequest(request) {
  return {
    first_name: request.first_name,
    last_name: request.last_name,
    username: request.username,
    password: request.password,
    type: request.type,
    status: request.status
  }
}

module.exports = {

  redirect: function(req, res) {
    res.redirect('/users');
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
    knex('users')
      .insert(newUser, '*')
      .then((user) => {
        res.send(user);
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
