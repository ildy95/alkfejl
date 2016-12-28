'use strict'

const Factory = use('Factory')

const Hash = use('Hash')
const User = use('App/Model/User')

class UserSeedSeeder {
    * run () {
        const user = new User()
        user.felhasznalonev = 'admin'
        user.email = 'admin@vagyok.hu'
        user.jelszo = yield Hash.make('123456')
        user.nev = 'Teszt Elek'
        user.admin = 1
        yield user.save()
    }
}

module.exports = UserSeedSeeder
