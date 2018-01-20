
exports.up = function(knex, Promise) {
  return knex.schema.createTable('approvals', (table) => {
    table.increments();
    table.integer('invoice_id')
      .references('id')
      .inTable('invoices')
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('approvals');
};
