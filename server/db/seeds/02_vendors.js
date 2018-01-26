
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('vendors').del()
    .then(function () {
      // Inserts seed entries
      return knex('vendors').insert([
        {
          user_id: 2,
          name: 'LionHeart Security',
          street_address: '123 Main Street',
          city: 'Phoenix',
          state: 'AZ',
          zipcode: '85085',
          phone_number: '123-456-9999',
          email: 'lion@security.com',
          tin: '122346543',
          tin_type: 'ein',
          net_terms: '15',
          payment_method: 'ach',
          gl_code: '001-001'
        },
        {
          user_id: 2,
          name: 'Cleaning Services',
          street_address: '123 New York Street',
          city: 'Tempe',
          state: 'AZ',
          zipcode: '85000',
          phone_number: '123-456-0000',
          email: 'cleaning@services.com',
          tin: '231904537',
          tin_type: 'ssn',
          net_terms: '30',
          payment_method: 'ck',
          gl_code: '002-002'
        }
      ]);
    });
};
