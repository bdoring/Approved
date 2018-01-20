const users = require("../controllers/users.js");
const vendors = require("../controllers/vendors.js");
const invoices = require("../controllers/invoices.js");


module.exports = function(app){
  //User routes
  app.get('/', users.redirect);
  app.get('/users', users.getAll);
  app.get('/users/:id', users.getOne);

  //Vendor Routes
  app.get('/vendors', vendors.getAll);
  app.get('/vendors/:id', vendors.getOne);

  //Invoice Routes
  app.get('/invoices', invoices.getAll);
  app.get('/invoices/:id', invoices.getOne);

}
