
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('approvals').del()
    .then(function () {
      // Inserts seed entries
      return knex('approvals').insert([
        {
          invoice_id: 2,
          user_id: 2
        }
      ]);
    });
};
