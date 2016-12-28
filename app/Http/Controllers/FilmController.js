'use strict'

const Eloadas = use('App/Model/E')
const Film = use('App/Model/Film')
const Seat = use('App/Model/Seat')
const Reservation = use('App/Model/Reservation')
const User = use('App/Model/User')
const Validator = use('Validator')
const Helpers = use('Helpers')
const fs = use('fs')

class FilmController {


  * main (request, response) {

    const page = Math.max(1, request.input('p'))
    const filters = {
      filmName: request.input('filmName') || '',
      mufaj: request.input('mufaj') || ''
    }

    const films = yield Film.query()
      .where(function () {
        if (filters.filmName.length > 0) this.where('cim', 'LIKE', `%${filters.filmName}%`)
        if (filters.mufaj.length > 0) this.where('mufaj', filters.mufaj)
      })
      .paginate(page, 9)

    yield response.sendView('main', {
      films: films .toJSON(),
      filters
    })
  }

    * create (request, response) {
    const  filmek = yield Film.all()

    yield response.sendView('film_create', { filmek: filmek.toJSON() })
  }

  * doCreate (request, response) {
    const filmData = request.all()
    const validation = yield Validator.validateAll(filmData, {
      cim: 'required',
      mufaj: 'required',
      hossz: 'required',
      korhatar: 'required',
      rendezo: 'required',
      leiras: 'required'
    })

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('film_create')
    } else {
        const recipeImage = request.file('image', { maxSize: '1mb', allowedExtensions: ['jpg', 'JPG'] })

        if (recipeImage != null && recipeImage.clientSize() > 0 && !recipeImage.validate()) {
          yield request
            .withAll()
            .andWith({ errors: [{ message: recipeImage.errors() }] })
            .flash()
        }

        const film = new Film()
        film.cim = filmData.cim
        film.mufaj = filmData.mufaj
        film.hossz = filmData.hossz
        film.korhatar = filmData.korhatar
        film.rendezo = filmData.rendezo
        film.leiras = filmData.leiras
        film.szinkronizalt = filmData.szinkronizalt
        yield film.save()
        yield recipeImage.move(Helpers.publicPath() + '/images', `${film.id}.jpg`)

        response.route('main')
      }
    }


    * edit (request, response) {
    const filmId = request.param('id')
    const film = yield Film.find(filmId)
	
    if (!film) {
	  yield response.notFound('Film not found.')
	  return;
    } 

    yield response.sendView('film_edit', { film: film.toJSON() })
  }

  /**
   *
   */
  * doEdit (request, response) {
    const filmId = request.param('id')
    const film = yield Film.find(filmId)

    if (!film) {
	    yield response.notFound('Film not found.')
	  return;
    } 
	  
    const filmData = request.all()
    const validation = yield Validator.validateAll(filmData, {
      cim: 'required',
      mufaj: 'required',
      hossz: 'required',
      korhatar: 'required',
      rendezo: 'required',
      leiras: 'required'
    })

    
    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()

      yield response.route('film_edit', {id:film.id})
	  return;
    } 

        film.cim = filmData.cim
        film.mufaj = filmData.mufaj
        film.hossz = filmData.hossz
        film.korhatar = filmData.korhatar
        film.rendezo = filmData.rendezo
        film.leiras = filmData.leiras

    yield film.update()

    response.route('film_page', { id: film.id })
    
  }


    * show (request, response) {
    const filmId = request.param('id')
    const film = yield Film.find(filmId)

    if (film) {
      yield response.sendView('film_page', { film: film.toJSON() })
    } else {
      response.notFound('Film not found.')
    }
  }

  * filmFoglalas(request, response) {
    const parameterek = request.params()
    const film = yield Film.find(parameterek.fid)
    const eloadas = yield Eloadas.find(parameterek.eid)

    const foglalasok = yield Reservation.all();
    

    const seatNames = ['1A', '1B', '1C', '1D', '1E', '1F',
                        '2A', '2B', '2C', '2D', '2E', '2F',
                        '3A', '3B', '3C', '3D', '3E', '3F',
                        '4A', '4B', '4C', '4D', '4E', '4F',
                        '5A', '5B', '5C', '5D', '5E', '5F',
                        '6A', '6B', '6C', '6D', '6E', '6F',
                        '7A', '7B', '7C', '7D', '7E', '7F',
                        '8A', '8B', '8C', '8D', '8E', '8F',
                        '9A', '9B', '9C', '9D', '9E', '9F',
                        '10A', '10B', '10C', '10D', '10E', '10F'];
    
    

    if (film) {
      yield response.sendView('film_foglalas', { film: film.toJSON(), eloadas: eloadas.toJSON(), 
                  seatNames,
                  foglalasok: foglalasok.toJSON() })
    } else {
      response.notFound('Film not found.')
    }
  }

  * doFilmFoglalas(request, response) {
    var parameterek = request.params()

    const eloadas = yield Eloadas.find(parameterek.id)
    const user = yield User.find(parameterek.id2)

    const foglalasData = request.all()

    if (foglalasData.f1A == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1A'
        yield foglalas.save()
    } 
    if (foglalasData.f1B == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1B'
        yield foglalas.save()
    } 
    if (foglalasData.f1C == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1C'
        yield foglalas.save()
    } 
    if (foglalasData.f1D == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1D'
        yield foglalas.save()
    } 
    if (foglalasData.f1E == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1E'
        yield foglalas.save()
    } 
    if (foglalasData.f1F == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f1F'
        yield foglalas.save()
    }

    if (foglalasData.f2A == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2A'
        yield foglalas.save()
    } 
    if (foglalasData.f2B == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2B'
        yield foglalas.save()
    } 
    if (foglalasData.f2C == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2C'
        yield foglalas.save()
    } 
    if (foglalasData.f2D == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2D'
        yield foglalas.save()
    } 
    if (foglalasData.f2E == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2E'
        yield foglalas.save()
    } 
    if (foglalasData.f2F == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f2F'
        yield foglalas.save()
    }

    if (foglalasData.f3A == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3A'
        yield foglalas.save()
    } 
    if (foglalasData.f3B == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3B'
        yield foglalas.save()
    } 
    if (foglalasData.f3C == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3C'
        yield foglalas.save()
    } 
    if (foglalasData.f3D == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3D'
        yield foglalas.save()
    } 
    if (foglalasData.f3E == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3E'
        yield foglalas.save()
    } 
    if (foglalasData.f3F == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f3F'
        yield foglalas.save()
    }

    if (foglalasData.f4A == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4A'
        yield foglalas.save()
    } 
    if (foglalasData.f4B == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4B'
        yield foglalas.save()
    } 
    if (foglalasData.f4C == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4C'
        yield foglalas.save()
      } 
    if (foglalasData.f4D == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4D'
        yield foglalas.save()
    } 
    if (foglalasData.f4E == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4E'
        yield foglalas.save()
    } 
    if (foglalasData.f4F == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f4F'
        yield foglalas.save()
    }

    if (foglalasData.f5A == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5A'
        yield foglalas.save()
    } 
    if (foglalasData.f5B == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5B'
        yield foglalas.save()
    } 
    if (foglalasData.f5C == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5C'
        yield foglalas.save()
    } 
    if (foglalasData.f5D == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5D'
        yield foglalas.save()
    } 
    if (foglalasData.f5E == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5E'
        yield foglalas.save()
    } 
    if (foglalasData.f5F == 1) {
        const foglalas = new Reservation()
        foglalas.user_id = parameterek.id2
        foglalas.ea_id = parameterek.id
        foglalas.helyek = 'f5F'
        yield foglalas.save()
    }

    response.route('main')
      
    
  }

  * doDelete (request, response) {
    const filmId = request.param('id')
    const film = yield Film.find(filmId)

    if (film) {
      yield film.delete()

      response.route('main')
    } else {
      response.notFound('Film not found.')
    }
  }

    * create_eloadas (request, response) {
    const  eloadasok = yield Eloadas.all()
    const films = yield Film.all()
    yield response.sendView('eloadas_create', { eloadasok: eloadasok.toJSON(), films: films .toJSON() })
  }

  /**
   *
   */
  * doCreate_eloadas (request, response) {
    const eaData = request.all()
    const validation = yield Validator.validateAll(eaData, {
      ido: 'required',
      terem: 'required',
      film_id: 'required'
    })

    var res = eaData.film_id.split(".");
    eaData.film_id = res[0]

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('eloadas_create')
    } else {

        const ea = new Eloadas()
        ea.ido = eaData.ido
        ea.terem = eaData.terem
        ea.film_id = eaData.film_id

        yield ea.save()
        
        response.route('main')
      }
    }


    * edit_eloadas (request, response) {
    const eaId = request.param('id')
    const ea = yield Eloadas.find(eaId)
	
    if (!ea) {
	    yield response.notFound('Eloadas not found.')
	  return;
    }

    yield response.sendView('eloadas_edit', { ea: ea.toJSON() })
  }

   * show_eloadas (request, response) {
    const eloadasok = yield Eloadas.all()
    const filmek = yield Film.all()
    yield response.sendView('eloadas_page', { eloadasok: eloadasok .toJSON(), filmek:filmek.toJSON() })

  }

  * foglalasList(request, response) {
    const foglalasok = yield Reservation.all();
    const eloadasok = yield Eloadas.all()
    const filmek = yield Film.all()

    const currentUserId = request.param('id')
    const fog = yield Reservation.query().where('user_id', currentUserId)


    var eaids = []
    fog.forEach(function(element) {
        eaids.push(element.ea_id);
    });
    var eaids2 = eaids.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    yield response.sendView('foglalasaim_list', { eloadasok: eloadasok .toJSON(), filmek:filmek.toJSON(), eaids2 })
  }


  * ajaxDelete(request, response) {
    const id = request.param('id');
    console.log('AAAAAAAAALMA')
    console.log(id);
    const film = yield Film.find(id);
    
      if (film) {    
        yield film.delete()
          response.ok({
            success: true
        })
        return
      }
      response.notFound('No film')
    }

    * ajaxCreateFilm(request, response) {
        const filmData = request.all()
        const filmImage = request.file('image', { maxSize: '1mb', allowedExtensions: ['jpg', 'JPG'] })

        if (filmImage != null && filmImage.clientSize() > 0 && !filmImage.validate()) {
          yield request
            .withAll()
            .andWith({ errors: [{ message: filmImage.errors() }] })
            .flash()
        }

        const film = new Film()
        film.cim = filmData.cim
        film.mufaj = filmData.mufaj
        film.hossz = filmData.hossz
        film.korhatar = filmData.korhatar
        film.rendezo = filmData.rendezo
        film.leiras = filmData.leiras
        film.szinkronizalt = filmData.szinkronizalt
        yield film.save()
        //yield filmImage.move(Helpers.publicPath() + '/images', `${film.id}.jpg`)

        response.ok({
            success: true
        })
        return
    }

    * ajaxCreateEa(request, response) {
        const eaData = request.all()

        var res = eaData.film_id.split(".");
        eaData.film_id = res[0]

        const ea = new Eloadas()
        ea.ido = eaData.ido
        ea.terem = eaData.terem
        ea.film_id = eaData.film_id

        yield ea.save()
        
        response.ok({
            success: true
        })
        return
    }

}

  function fileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.constants.F_OK, err => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}


  


module.exports = FilmController

const Route = use('Route')

Route.get('/', 'FilmController.main').as('main')
