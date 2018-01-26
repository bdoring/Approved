const knex = require("../db/knex.js");

function getVendorFromRequest(request) {
  console.log("request", request)
  return {
    user_id: request.user ? request.user.id : request.user_id,
    name: request.name.toUpperCase(),
    tin: request.tin || null,
    tin_type: request.tin_type.toUpperCase(),
    street_address: request.street_address.toUpperCase(),
    city: request.city.toUpperCase(),
    state: request.state.toUpperCase(),
    zipcode: request.zipcode.toUpperCase(),
    phone_number: request.phone_number,
    email: request.email.toUpperCase(),
    net_terms: request.net_terms,
    payment_method: request.payment_method.toUpperCase(),
    gl_code: request.gl_code
  }
}

module.exports = {

  getAll: function(req, res) {
    knex('vendors')
      .join('users', 'users.id', 'vendors.user_id')
      .select('vendors.*', 'users.first_name', 'users.last_name')
      .then((vendors) => {
        res.send(vendors);
      })
  },

  getOne: function(req, res) {
    knex('vendors')
      .join('users', 'users.id', 'vendors.user_id')
      .select('vendors.*','users.first_name', 'users.last_name')
      .where('vendors.id', req.params.id)
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
        res.status(200).send(vendor);
      })
  },

  updateOne: function(req, res) {
    let updatedVendor = getVendorFromRequest(req.body);
    console.log("updatedVendor:", updatedVendor);
    knex('vendors')
      .update(updatedVendor, '*')
      .where('id', req.params.id)
      .then((vendor) => {
        vendor[0] ? res.status(200).send(vendor) : res.status(400).send({error: "Vendor Not Found."})
      })
  }
}
