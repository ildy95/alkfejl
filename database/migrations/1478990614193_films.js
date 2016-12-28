'use strict'

const Schema = use('Schema')

class FilmsTableSchema extends Schema {

  up () {
    this.create('films', (table) => {
      table.increments()
      table.string('cim').notNullable()
      table.string('mufaj').notNullable()
      table.integer('hossz').unsigned()
      table.integer('korhatar').unsigned()
      table.string('rendezo').notNullable()
      table.text('leiras').notNullable()
      table.boolean('szinkronizalt').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('films')
  }

}

module.exports = FilmsTableSchema
