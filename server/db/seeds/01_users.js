
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          first_name: 'Barbara',
          last_name: 'Doring',
          username: 'babs@me.com',
          password: '123',
          type: 'admin',
          status: 'active'
        },
        {
          first_name: 'Emily',
          last_name: 'Stratton',
          username: 'emily@me.com',
          password: '123',
          type: 'approver',
          status: 'active'
        }
      ]);
    });
};
