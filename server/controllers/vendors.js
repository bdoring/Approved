const knex = require("../db/knex.js");

function getVendorFromRequest(request) {
  return {
    user_id: request.user_id,
    name: request.name,
    tin: request.tin || null,
    tin_type: request.tin_type,
    street_address: request.street_address,
    city: request.city,
    state: request.state,
    zip: request.zip,
    phone_number: request.phone_number,
    email: request.email,
    payment_terms: request.payment_terms,
    payment_method: request.payment_method,
    gl_code: request.gl_code
  }
}

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
        vendor[0] ? res.send(vendor) : res.send({error: "Vendor Not Found."});
      })
  },

  createOne: function(req, res) {
    let newVendor = getVendorFromRequest(req.body);
    console.log("newVendor", newVendor);
    knex('vendors')
      .insert(newVendor, '*')
      .then((vendor) => {
        res.send(vendor);
      })
  },

  updateOne: function(req, res) {
    let updatedVendor = getVendorFromRequest(req.body);
    knex('vendors')
      .update(updatedVendor, '*')
      .where('id', req.params.id)
      .then((vendor) => {
        vendor[0] ? res.send(vendor) : res.send({error: "Vendor Not Found."})
      })
  }
}
