'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')


Route.get('/login', 'UserController.login').as('login')
Route.post('/login', 'UserController.doLogin').as('do_login')
Route.get('/register', 'UserController.register').as('register')
Route.post('/register', 'UserController.doRegister').as('do_register')
Route.get('/logout', 'UserController.doLogout').as('do_logout').middleware('auth')
Route.get('/profile', 'UserController.profile').as('profile').middleware('auth')
Route.post('/profile/edit', 'UserController.doProfileEdit').as('do_profile_edit').middleware('auth')
Route.post('/profile/edit_password', 'UserController.doPasswordEdit').as('do_password_edit').middleware('auth')
Route.get('/registrations', 'UserController.checkRegistrations').as('check_registrations')
Route.get('/registrations/:id/elfogad', 'UserController.elfogad_registration').as('elfogad')
Route.get('/registrations/:id/elutasit', 'UserController.elutasit_registration').as('elutasit')


Route.get('/', 'FilmController.main').as('main')

Route.get('/film/create', 'FilmController.create').as('film_create').middleware('auth')
Route.post('/film/create', 'FilmController.doCreate').as('do_film_create')
Route.get('/film/:id/edit', 'FilmController.edit').as('film_edit')
Route.post('/film/:id/edit', 'FilmController.doEdit').as('do_film_edit')
Route.get('/film/:id/delete', 'FilmController.doDelete').as('film_delete')
Route.get('/film/:id', 'FilmController.show').as('film_page')
Route.get('/film/:fid/:eid/foglalas', 'FilmController.filmFoglalas').as('film_foglalas')
Route.post('/film/:id/:id2/foglalas', 'FilmController.doFilmFoglalas').as('do_film_foglalas')
Route.get('/:id/foglalaslist', 'FilmController.foglalasList').as('foglalas_list')


Route.get('/eloadas/create', 'FilmController.create_eloadas').as('eloadas_create').middleware('auth')
Route.post('/eloadas/create', 'FilmController.doCreate_eloadas').as('do_eloadas_create')
Route.get('/eloadasok', 'FilmController.show_eloadas').as('eloadasok_page')

Route.group('ajax', function () {
  Route.post('/login', 'UserController.ajaxLogin')
  Route.post('/register', 'UserController.ajaxRegister')
  Route.post('/film/create', 'FilmController.ajaxCreateFilm')
  Route.delete('/film/:id/delete', 'FilmController.ajaxDelete')
  Route.delete('/registrations/:id/elutasit', 'UserController.ajaxElutasit')
}).prefix('/ajax')

