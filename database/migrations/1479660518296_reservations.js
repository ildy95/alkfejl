'use strict'

const Schema = use('Schema')

class ReservationsTableSchema extends Schema {

  up () {
    this.create('reservations', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('ea_id').unsigned().references('id').inTable('es')
      table.string('helyek', 254)
      table.timestamps()
    })
  }

  down () {
    this.drop('reservations')
  }

}

module.exports = ReservationsTableSchema
