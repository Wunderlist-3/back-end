
exports.up = function(knex) {
    return knex.schema.createTable('lists', tbl=>{
        tbl.increments();
        tbl.string('name', 128).notNullable().index()
    })
    .createTable('users', tbl=>{
        tbl.increments();
        tbl.string('username', 255).notNullable().unique().index()
        tbl.string('password').notNullable();
        tbl.string('name', 255).notNullable().index();
    })

    .createTable('tasks', tbl=>{
        tbl.increments();
        //foreign key
        tbl.integer('list_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('lists')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        tbl.string('description').notNullable();
        tbl.boolean('completed').notNullable().defaultTo(false)
        tbl.boolean('deleted').notNullable().defaultTo(false);
        tbl.string('frequency').notNullable().index();
        tbl.integer('day').index();
        tbl.string('weekday').index();
        tbl.string('month').index();

    })

    .createTable('deleted_tasks', tbl=>{
        tbl.increments();
        //foreign key
        tbl.integer('task_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('tasks')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        tbl.date('date_deleted').notNullable().index();
        tbl.date('date_expired').notNullable().index();

    })

    .createTable('user_lists', tbl=>{
        tbl.primary(['list_id', 'user_id'])

        //foreign keys
        tbl.integer('list_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('lists')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .index();

        tbl.integer('user_id')
            .unsigned()       
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .index();
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('user_lists')
        .dropTableIfExists('deleted_tasks')
        .dropTableIfExists('tasks')
        .dropTableIfExists('users')
        .dropTableIfExists('lists')
  
};
