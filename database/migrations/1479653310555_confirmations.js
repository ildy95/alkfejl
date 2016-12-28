'use strict'

const Schema = use('Schema')

class ConfirmationsTableSchema extends Schema {

  up () {
    this.create('confirmations', (table) => {
      table.increments()
      table.string('felhasznalonev', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('jelszo', 60).notNullable()
      table.string('nev')
      table.boolean('admin').defaultTo(false)
      table.boolean('elfogadva').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('confirmations')
  }

}

module.exports = ConfirmationsTableSchema
