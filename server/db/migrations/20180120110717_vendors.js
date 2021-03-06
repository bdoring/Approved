
exports.up = function(knex, Promise) {
  return knex.schema.createTable('vendors', (table) => {
    table.increments();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.string('name');
    table.string('street_address');
    table.string('city');
    table.string('state');
    table.string('zipcode');
    table.string('phone_number');
    table.string('email');
    table.string('tin');
    table.string('tin_type');
    table.string('net_terms');
    table.string('payment_method');
    table.string('gl_code');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('vendors');
};
