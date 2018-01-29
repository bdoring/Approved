const knex = require("../db/knex.js");
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
let s3Bucket = new AWS.S3({params: {Bucket: 'approved-capstone'}});
const baseAWS_URL = "https://s3-us-west-2.amazonaws.com/approved-capstone/"

function getInvoiceFromRequest(request) {
  return {
    vendor_id: request.vendor_id,
    invoice_number: request.invoice_number.toUpperCase(),
    amount: request.amount,
    invoice_date: request.invoice_date,
    invoice_due_date: request.invoice_due_date,
    action_user: request.action_user
  }
}

module.exports = {

  getAll: function(req, res) {
    knex('invoices')
      .join('vendors', 'vendors.id', 'invoices.vendor_id')
      .join('users', 'users.id', 'invoices.action_user')
      .select('invoices.*', 'vendors.name', 'vendors.net_terms', 'vendors.payment_method', 'users.first_name', 'users.last_name')
      .orderBy('invoices.invoice_due_date', 'asc')
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
    console.log('SERVER - file upload req.body:', req.body);
    console.log('SERVER - file upload req.files:', req.files);
    console.log('UPLOADING...');
    let newInvoice = getInvoiceFromRequest(req.body);
    //look for duplicated invoices from same vendor
    knex('invoices')
      .where('invoice_number', newInvoice.invoice_number)
      .where('vendor_id', newInvoice.vendor_id)
      .then((duplicateInvoice) => {
        if (duplicateInvoice[0]) {
          res.status(400).send({error: 'Duplicate invoice number. Please provide unique invoice number.'});
        } else {
          let uploadInvoice = {
            Key: `${newInvoice.vendor_id}-${newInvoice.invoice_number}`,
            Body: req.files.invoicePDF.data,
            ContentType: req.files.invoicePDF.mimetype,
            ACL: 'public-read'
          };
          s3Bucket.putObject(uploadInvoice, function(err, data) {
            if (err) {
              console.log(err);
              return;
            }
          });
          newInvoice.url = baseAWS_URL + uploadInvoice.Key;
          knex('invoices')
            .insert(newInvoice, '*')
            .then((invoice) => {
              res.send(invoice);
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
  },

  approveOrReject: function(req, res){
    let newStatus = {
      status: req.body.status,
      updated_at: knex.fn.now()
    };
    console.log('new invoice status:', newStatus)
    knex('invoices')
      .update(newStatus, '*')
      .where('id', req.params.id)
      .then(update => {
        res.status(200).send(update);
      })
      .catch(err => {
        res.status(500).send({error: "Invoice Not Found."});
      })
  },

  schedule: function(req, res){
    console.log('Scheduling invoice number:', req.params.id);
    knex('invoices')
      .update({scheduled: true}, '*')
      .where('id', req.params.id)
      .then(scheduledInvoice => {
        res.status(200).send(scheduledInvoice);
      })
      .catch(err => {
        res.status(500).send({error: "Invoice Not Found."});
      })
  }
}
