
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          first_name: 'Barbara',
          last_name: 'Doring',
          username: 'babs@me.com',
          password: '123',
          type: 'admin',
          status: 'active'
        },
        {
          id: 2,
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
