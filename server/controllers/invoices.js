const knex = require("../db/knex.js");

function getInvoiceFromRequest(request) {
  return {
    vendor_id: request.vendor_id,
    invoice_number: request.invoice_number,
    amount: request.amount,
    invoice_date: request.invoice_date,
    invoice_due_date: request.invoice_due_date,
    url: request.url
  }
}

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
        invoice[0] ? res.send(invoice) : res.send({error: "Invoice Not Found."});
      })
  },

  createOne: function(req, res) {
    let newInvoice = getInvoiceFromRequest(req.body);
    //look for duplicated invoices from same vendor
    knex('invoices')
      .where('invoice_number', newInvoice.invoice_number)
      .where('vendor_id', newInvoice.vendor_id)
      .then((duplicateInvoice) => {
        if (duplicateInvoice[0]) {
          res.send({error: 'Duplicate invoice number. Please provide unique invoice number.'});
        } else {
          knex('vendors')
            .where('id', newInvoice.vendor_id)
            .then((vendor) => {
              //get approver of invoice
              newInvoice.action_user = vendor[0].user_id;
              knex('invoices')
                .insert(newInvoice, '*')
                .then((invoice) => {
                  res.send(invoice);
                })
            })
        }
      })
  },

  updateOne: function(req, res) {
    let invoiceTobeUpdated = getInvoiceFromRequest(req.body);
    //the following query checks if the admin is trying to change the current invoice number to one that has already been assigned to a different invoice from same member - this change should not be allowed
    knex('invoices')
      .where('invoice_number', invoiceTobeUpdated.invoice_number)
      .where('vendor_id', invoiceTobeUpdated.vendor_id)
      .whereNot('id', req.params.id)
      .then((duplicateInvoice) => {
        if (duplicateInvoice[0]) {
          res.send({error: 'Duplicate invoice number. Please provide unique invoice number.'});
        } else {
          knex('invoices')
            .update(invoiceTobeUpdated, '*')
            .where('id', req.params.id)
            .then((invoice) => {
              invoice[0] ? res.send(invoice) : res.send({error: "Invoice Not Found."});
            })
        }
      })
  }
}
