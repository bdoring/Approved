const knex = require("../db/knex.js");

module.exports = {

  getAll: function(req, res) {
    knex('invoices')
      .then((invoices) => {
        res.send(invoices);
      })
  },

  getOne: function(req, res) {
    knex('invoices')
      .where('id', req.params.id)
      .then((invoice) => {
        invoice[0] ? res.send(invoice) : res.send("Invoice Not Found.");
      })
  }
}
