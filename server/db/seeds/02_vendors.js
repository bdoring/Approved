
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('vendors').del()
    .then(function () {
      // Inserts seed entries
      return knex('vendors').insert([
        {
          id: 1,
          user_id: 1,
          name: 'LionHeart Security',
          street_address: '123 Main Street',
          city: 'Phoenix',
          state: 'AZ',
          zip: '85085',
          phone_number: '123-456-9999',
          email: 'lion@security.com',
          payment_terms: '15',
          payment_method: 'ach',
          gl_code: '001-001'
        },
        {
          id: 2,
          user_id: 1,
          name: 'Cleaning Services',
          street_address: '123 New York Street',
          city: 'Tempe',
          state: 'AZ',
          zip: '85000',
          phone_number: '123-456-0000',
          email: 'cleaning@services.com',
          payment_terms: '30',
          payment_method: 'ck',
          gl_code: '002-002'
        }
      ]);
    });
};
