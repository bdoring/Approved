
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('invoices').del()
    .then(function () {
      // Inserts seed entries
      return knex('invoices').insert([
        {
          id: 1,
          vendor_id: 1,
          invoice_number: '001',
          amount: '500.00',
          invoice_date: '2018-01-20',
          invoice_due_date: '2018-02-02',
          url: 'https://i.ytimg.com/vi/oGoPUw0YBAg/maxresdefault.jpg',
          status: 'pending',
          action_user: 2
        },
        {
          id: 2,
          vendor_id: 2,
          invoice_number: '001',
          amount: '500.00',
          invoice_date: '2018-01-15',
          invoice_due_date: '2018-02-02',
          url: 'https://photos.smugmug.com/Dogs/Goldens/BestOfGoldens/i-hrRtHNW/1/8e9d7992/L/2009_09_05%20920s2-L.jpg',
          status: 'approved',
          action_user: 2
        }
      ]);
    });
};
