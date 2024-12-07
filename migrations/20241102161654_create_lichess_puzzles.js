/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('lichess_puzzles', function(table) {
      table.increments('id').primary();
      table.string('puzzle_id').notNullable().unique();
      table.string('fen').notNullable();
      table.string('moves').notNullable();
      table.integer('rating');
      table.integer('rating_deviation');
      table.integer('popularity');
      table.integer('nb_plays');
      table.string('themes');
      table.string('game_url');
      table.string('opening_tags');
    });
  };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('lichess_puzzles');
  };