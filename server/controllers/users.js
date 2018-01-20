const knex = require("../db/knex.js");

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
        user[0] ? res.send(user) : res.send("User Not Found.");
      })
  }
}
