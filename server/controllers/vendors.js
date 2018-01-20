const knex = require("../db/knex.js");

module.exports = {

  getAll: function(req, res) {
    knex('vendors')
      .then((vendors) => {
        res.send(vendors);
      })
  },

  getOne: function(req, res) {
    knex('vendors')
      .where('id', req.params.id)
      .then((vendor) => {
        vendor[0] ? res.send(vendor) : res.send("Vendor Not Found.");
      })
  }
}
